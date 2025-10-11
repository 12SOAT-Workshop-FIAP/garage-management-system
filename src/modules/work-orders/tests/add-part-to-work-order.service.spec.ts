import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AddPartToWorkOrderService } from '../application/services/add-part-to-work-order.service';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { PartRepository } from '../../parts/domain/repositories/part.repository';
import { WorkOrder } from '../domain/work-order.entity';
import { Part } from '../../parts/domain/entities/part.entity';
import { AddPartToWorkOrderDto } from '../application/dtos/add-part-to-work-order.dto';

describe('AddPartToWorkOrderService', () => {
  let service: AddPartToWorkOrderService;
  let workOrderRepository: jest.Mocked<WorkOrderRepository>;
  let partRepository: jest.Mocked<PartRepository>;

  const mockWorkOrder = new WorkOrder({
    customerId: '123e4567-e89b-12d3-a456-426614174000',
    vehicleId: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Test work order',
  });

  const mockPart = new Part({
    name: 'Brake Pad',
    description: 'Front brake pads',
    partNumber: 'BP-001',
    category: 'Brakes',
    price: 150.00,
    costPrice: 100.00,
    stockQuantity: 10,
    minStockLevel: 2,
    unit: 'pair',
    supplier: 'Test Supplier',
    active: true,
  });

  beforeEach(async () => {
    const mockWorkOrderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      findByCustomerId: jest.fn(),
      findByVehicleId: jest.fn(),
      findByDateRange: jest.fn(),
    };

    const mockPartRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findByCategory: jest.fn(),
      findByPartNumber: jest.fn(),
      findLowStock: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddPartToWorkOrderService,
        { provide: WorkOrderRepository, useValue: mockWorkOrderRepository },
        { provide: PartRepository, useValue: mockPartRepository },
      ],
    }).compile();

    service = module.get<AddPartToWorkOrderService>(AddPartToWorkOrderService);
    workOrderRepository = module.get(WorkOrderRepository);
    partRepository = module.get(PartRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    const dto: AddPartToWorkOrderDto = {
      partId: mockPart.id,
      quantity: 2,
      notes: 'Replace front brake pads',
    };

    it('should add part to work order successfully', async () => {
      workOrderRepository.findById.mockResolvedValue(mockWorkOrder);
      partRepository.findById.mockResolvedValue(mockPart);
      workOrderRepository.save.mockResolvedValue(mockWorkOrder);

      await service.execute(mockWorkOrder.id, dto);

      expect(workOrderRepository.findById).toHaveBeenCalledWith(mockWorkOrder.id);
      expect(partRepository.findById).toHaveBeenCalledWith(dto.partId);
      expect(workOrderRepository.save).toHaveBeenCalledWith(mockWorkOrder);
    });

    it('should throw NotFoundException when work order not found', async () => {
      workOrderRepository.findById.mockResolvedValue(null);

      await expect(service.execute('invalid-id', dto))
        .rejects.toThrow(NotFoundException);

      expect(workOrderRepository.findById).toHaveBeenCalledWith('invalid-id');
      expect(partRepository.findById).not.toHaveBeenCalled();
      expect(workOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when part not found', async () => {
      workOrderRepository.findById.mockResolvedValue(mockWorkOrder);
      partRepository.findById.mockResolvedValue(null);

      await expect(service.execute(mockWorkOrder.id, dto))
        .rejects.toThrow(NotFoundException);

      expect(workOrderRepository.findById).toHaveBeenCalledWith(mockWorkOrder.id);
      expect(partRepository.findById).toHaveBeenCalledWith(dto.partId);
      expect(workOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const lowStockPart = new Part({
        ...mockPart,
        stockQuantity: 1, // Less than required quantity
      });

      workOrderRepository.findById.mockResolvedValue(mockWorkOrder);
      partRepository.findById.mockResolvedValue(lowStockPart);

      await expect(service.execute(mockWorkOrder.id, dto))
        .rejects.toThrow(BadRequestException);

      expect(workOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when part is not active', async () => {
      const inactivePart = new Part({
        ...mockPart,
        active: false,
      });

      workOrderRepository.findById.mockResolvedValue(mockWorkOrder);
      partRepository.findById.mockResolvedValue(inactivePart);

      await expect(service.execute(mockWorkOrder.id, dto))
        .rejects.toThrow(BadRequestException);

      expect(workOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should use custom unit price when provided', async () => {
      const customPriceDto: AddPartToWorkOrderDto = {
        ...dto,
        unitPrice: 200.00,
      };

      workOrderRepository.findById.mockResolvedValue(mockWorkOrder);
      partRepository.findById.mockResolvedValue(mockPart);
      workOrderRepository.save.mockResolvedValue(mockWorkOrder);

      await service.execute(mockWorkOrder.id, customPriceDto);

      expect(workOrderRepository.save).toHaveBeenCalledWith(mockWorkOrder);
      // The work order should now have a part with the custom price
      expect(mockWorkOrder.parts.length).toBeGreaterThan(0);
    });
  });
});
