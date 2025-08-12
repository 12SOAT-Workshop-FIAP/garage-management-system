import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WorkOrderORM } from '../infrastructure/entities/work-order.entity';
import { WorkOrderServiceORM } from '../infrastructure/entities/work-order-service.entity';
import { WorkOrderPartORM } from '../infrastructure/entities/work-order-part.entity';
import { Part } from '../../parts/infrastructure/entities/part.entity';
import { CustomerEntity } from '../../customers/infrastructure/customer.entity';
import { Vehicle } from '../../vehicles/domain/vehicle.entity';
import { WorkOrderTypeOrmRepository } from '../infrastructure/repositories/work-order.typeorm.repository';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { AddPartToWorkOrderService } from '../application/services/add-part-to-work-order.service';
import { RemovePartFromWorkOrderService } from '../application/services/remove-part-from-work-order.service';
import { UpdatePartQuantityService } from '../application/services/update-part-quantity.service';
import { ApprovePartService } from '../application/services/approve-part.service';
import { ApplyPartService } from '../application/services/apply-part.service';
import { PartRepository } from '../../parts/domain/part.repository';
import { PartTypeOrmRepository } from '../../parts/infrastructure/repositories/part.typeorm.repository';
import { WorkOrder } from '../domain/work-order.entity';
import { WorkOrderStatus } from '../domain/work-order-status.enum';
import { AddPartToWorkOrderDto } from '../application/dtos/add-part-to-work-order.dto';
import { UpdatePartQuantityDto } from '../application/dtos/update-part-quantity.dto';
import { Part as PartDomain } from '../../parts/domain/part.entity';

describe('WorkOrder Parts Integration', () => {
  let module: TestingModule;
  let dataSource: DataSource;
  let workOrderRepository: WorkOrderRepository;
  let partRepository: PartRepository;
  let addPartService: AddPartToWorkOrderService;
  let removePartService: RemovePartFromWorkOrderService;
  let updatePartQuantityService: UpdatePartQuantityService;
  let approvePartService: ApprovePartService;
  let applyPartService: ApplyPartService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_TEST_DB || 'garage',
          entities: [WorkOrderORM, WorkOrderServiceORM, WorkOrderPartORM, Part, CustomerEntity, Vehicle],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([WorkOrderORM, WorkOrderServiceORM, WorkOrderPartORM, Part]),
      ],
      providers: [
        AddPartToWorkOrderService,
        RemovePartFromWorkOrderService,
        UpdatePartQuantityService,
        ApprovePartService,
        ApplyPartService,
        { provide: WorkOrderRepository, useClass: WorkOrderTypeOrmRepository },
        { provide: PartRepository, useClass: PartTypeOrmRepository },
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    workOrderRepository = module.get<WorkOrderRepository>(WorkOrderRepository);
    partRepository = module.get<PartRepository>(PartRepository);
    addPartService = module.get<AddPartToWorkOrderService>(AddPartToWorkOrderService);
    removePartService = module.get<RemovePartFromWorkOrderService>(RemovePartFromWorkOrderService);
    updatePartQuantityService = module.get<UpdatePartQuantityService>(UpdatePartQuantityService);
    approvePartService = module.get<ApprovePartService>(ApprovePartService);
    applyPartService = module.get<ApplyPartService>(ApplyPartService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await dataSource.query('DELETE FROM work_order_parts');
    await dataSource.query('DELETE FROM work_order_services');
    await dataSource.query('DELETE FROM work_orders');
    await dataSource.query('DELETE FROM parts');
    await dataSource.query('DELETE FROM vehicles');
    await dataSource.query('DELETE FROM customers');
  });

  describe('Part Management Flow', () => {
    let workOrder: WorkOrder;
    let part: PartDomain;

    beforeEach(async () => {
      // Create customer using repository
      const customerRepository = dataSource.getRepository(CustomerEntity);
      const customer = customerRepository.create({
        name: 'Test Customer',
        personType: 'INDIVIDUAL',
        document: '12345678901',
        phone: '555-0123',
        status: true,
      });
      await customerRepository.save(customer);

      // Create vehicle using repository
      const vehicleRepository = dataSource.getRepository(Vehicle);
      const vehicle = vehicleRepository.create({
        brand: 'Toyota',
        model: 'Corolla',
        plate: 'ABC1234',
        year: 2020,
        customer: customer,
      });
      await vehicleRepository.save(vehicle);

      // Create a work order
      workOrder = new WorkOrder({
        customerId: customer.id.toString(),
        vehicleId: vehicle.id.toString(),
        description: 'Test work order for parts integration',
      });
      await workOrderRepository.save(workOrder);

      // Create a part
      part = new PartDomain({
        name: 'Brake Pad Set',
        description: 'Front brake pads for sedans',
        partNumber: 'BP-001',
        category: 'Brakes',
        price: 150.00,
        costPrice: 100.00,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'set',
        supplier: 'Brake Masters Inc',
        active: true,
      });
      await partRepository.save(part);
    });

    it('should add part to work order successfully', async () => {
      const addPartDto: AddPartToWorkOrderDto = {
        partId: part.id,
        quantity: 2,
        notes: 'Replace worn brake pads',
      };

      await addPartService.execute(workOrder.id, addPartDto);

      const updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder).toBeDefined();
      expect(updatedWorkOrder!.parts).toHaveLength(1);
      
      const addedPart = updatedWorkOrder!.parts[0];
      expect(addedPart.partId).toBe(part.id);
      expect(addedPart.partName).toBe(part.name);
      expect(addedPart.quantity).toBe(2);
      expect(parseFloat(addedPart.unitPrice.toString())).toBe(part.price);
      expect(parseFloat(addedPart.totalPrice.toString())).toBe(300.00); // 2 * 150.00
      expect(addedPart.notes).toBe('Replace worn brake pads');
      expect(addedPart.isApproved).toBe(false);
    });

    it('should update part quantity successfully', async () => {
      // First add a part
      const addPartDto: AddPartToWorkOrderDto = {
        partId: part.id,
        quantity: 2,
      };
      await addPartService.execute(workOrder.id, addPartDto);

      // Then update quantity
      const updateQuantityDto: UpdatePartQuantityDto = {
        quantity: 4,
      };
      await updatePartQuantityService.execute(workOrder.id, part.id, updateQuantityDto);

      const updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder!.parts[0].quantity).toBe(4);
      expect(updatedWorkOrder!.parts[0].totalPrice).toBe(600.00); // 4 * 150.00
    });

    it('should approve part successfully', async () => {
      // First add a part
      const addPartDto: AddPartToWorkOrderDto = {
        partId: part.id,
        quantity: 1,
      };
      await addPartService.execute(workOrder.id, addPartDto);

      // Then approve the part
      await approvePartService.execute(workOrder.id, part.id);

      const updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder!.parts[0].isApproved).toBe(true);
    });

    it('should apply part successfully when approved', async () => {
      // First add a part
      const addPartDto: AddPartToWorkOrderDto = {
        partId: part.id,
        quantity: 1,
      };
      await addPartService.execute(workOrder.id, addPartDto);

      // Approve the part
      await approvePartService.execute(workOrder.id, part.id);

      // Then apply the part
      await applyPartService.execute(workOrder.id, part.id);

      const updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder!.parts[0].appliedAt).toBeInstanceOf(Date);
    });

    it('should remove part from work order successfully', async () => {
      // First add a part
      const addPartDto: AddPartToWorkOrderDto = {
        partId: part.id,
        quantity: 1,
      };
      await addPartService.execute(workOrder.id, addPartDto);

      let updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder!.parts).toHaveLength(1);

      // Then remove the part
      await removePartService.execute(workOrder.id, part.id);

      updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder!.parts).toHaveLength(0);
    });

    it('should calculate total costs correctly with parts', async () => {
      // Add a part
      const addPartDto: AddPartToWorkOrderDto = {
        partId: part.id,
        quantity: 2,
        unitPrice: 175.00, // Custom price
      };
      await addPartService.execute(workOrder.id, addPartDto);

      const updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      
      // Check that estimated cost includes parts cost
      expect(parseFloat(updatedWorkOrder!.getTotalPartsCost().toString())).toBe(350.00); // 2 * 175.00
      expect(parseFloat(updatedWorkOrder!.estimatedCost.toString())).toBe(350.00); // Only parts, no services
    });

    it('should handle multiple parts correctly', async () => {
      // Create another part
      const part2 = new PartDomain({
        name: 'Oil Filter',
        description: 'Engine oil filter',
        partNumber: 'OF-001',
        category: 'Engine',
        price: 25.00,
        costPrice: 15.00,
        stockQuantity: 20,
        minStockLevel: 5,
        unit: 'piece',
        supplier: 'Engine Parts Co',
        active: true,
      });
      await partRepository.save(part2);

      // Add first part
      await addPartService.execute(workOrder.id, {
        partId: part.id,
        quantity: 1,
      });

      // Add second part
      await addPartService.execute(workOrder.id, {
        partId: part2.id,
        quantity: 3,
      });

      const updatedWorkOrder = await workOrderRepository.findById(workOrder.id);
      expect(updatedWorkOrder!.parts).toHaveLength(2);
      expect(updatedWorkOrder!.getTotalPartsCost()).toBe(225.00); // 150 + (3 * 25)
    });
  });
});
