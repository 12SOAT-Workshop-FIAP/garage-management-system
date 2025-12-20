import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/entities/work-order.entity';
import { WorkOrderServiceORM } from '../infrastructure/entities/work-order-service.entity';
import { WorkOrderPartORM } from '../infrastructure/entities/work-order-part.entity';
import { WorkOrderController } from './controllers/work-order.controller';
import { PublicWorkOrderController } from './controllers/public-work-order.controller';
import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { CreateWorkOrderWithCustomerIdentificationService } from '../application/services/create-work-order-with-customer-identification.service';
import { UpdateWorkOrderService } from '../application/services/update-work-order.service';
import { FindWorkOrderService } from '../application/services/find-work-order.service';
import { CreateWorkOrderWithServicesService } from '../application/services/create-work-order-with-services.service';
import { AddServiceToWorkOrderService } from '../application/services/add-service-to-work-order.service';
import { ManageWorkOrderServicesService } from '../application/services/manage-work-order-services.service';
import { AddPartToWorkOrderService } from '../application/services/add-part-to-work-order.service';
import { RemovePartFromWorkOrderService } from '../application/services/remove-part-from-work-order.service';
import { UpdatePartQuantityService } from '../application/services/update-part-quantity.service';
import { ApprovePartService } from '../application/services/approve-part.service';
import { ApplyPartService } from '../application/services/apply-part.service';
import { WorkOrderTypeOrmRepository as OldWorkOrderTypeOrmRepository } from '../infrastructure/repositories/work-order.typeorm.repository';
import { WorkOrderTypeOrmRepository } from '../infrastructure/adapters/repositories/work-order-typeorm.repository';
import { WorkOrderRepository as OldWorkOrderRepository } from '../domain/work-order.repository';
import { WorkOrderRepository } from '../domain/repositories/work-order.repository';
// Use Cases
import { CreateWorkOrderUseCase } from '../application/use-cases/create-work-order.use-case';
import { UpdateWorkOrderUseCase } from '../application/use-cases/update-work-order.use-case';
import { DeleteWorkOrderUseCase } from '../application/use-cases/delete-work-order.use-case';
import { GetWorkOrderByIdUseCase } from '../application/use-cases/get-work-order-by-id.use-case';
import { GetAllWorkOrdersUseCase } from '../application/use-cases/get-all-work-orders.use-case';
import { GetWorkOrdersByCustomerUseCase } from '../application/use-cases/get-work-orders-by-customer.use-case';
import { GetWorkOrdersByStatusUseCase } from '../application/use-cases/get-work-orders-by-status.use-case';
import { GetWorkOrdersByVehicleUseCase } from '../application/use-cases/get-work-orders-by-vehicle.use-case';
import { ApproveWorkOrderUseCase } from '../application/use-cases/approve-work-order.use-case';
import { ServicesModule } from '../../services/services.module';
import { PartsModule } from '../../parts/parts.module';
import { CustomersModule } from '@modules/customers/customers.module';
import { EmailModule } from '@modules/email/email.module';
import { VehiclesModule } from '@modules/vehicles/vehicles.module';
import { PartOrmEntity } from '@modules/parts/infrastructure/entities/part-orm.entity';
import { CustomerReaderPort, VehicleReaderPort, WorkOrderNotificationPort } from '../domain/ports';
import {
  CustomerReaderAdapter,
  VehicleReaderAdapter,
  WorkOrderNotificationAdapter,
} from '../infrastructure/adapters';
import { CustomerRepository } from '@modules/customers/domain/repositories/customer.repository';
import { FindVehicleByIdUseCase } from '@modules/vehicles/application/use-cases/find-vehicle-by-id.usecase';
import { SendEmailNotificationPort } from '@modules/email/ports/send-email-notification.port';
import { NewRelicService } from '@shared/infrastructure/new-relic.service';
import { WinstonLoggerService } from '@shared/infrastructure/winston-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrderORM, WorkOrderServiceORM, WorkOrderPartORM, PartOrmEntity]),
    CustomersModule,
    VehiclesModule,
    ServicesModule,
    PartsModule,
    EmailModule,
  ],
  controllers: [WorkOrderController, PublicWorkOrderController],
  providers: [
    // Legacy services (mantidos para compatibilidade)
    CreateWorkOrderService,
    CreateWorkOrderWithCustomerIdentificationService,
    UpdateWorkOrderService,
    FindWorkOrderService,
    CreateWorkOrderWithServicesService,
    AddServiceToWorkOrderService,
    ManageWorkOrderServicesService,
    AddPartToWorkOrderService,
    RemovePartFromWorkOrderService,
    UpdatePartQuantityService,
    ApprovePartService,
    ApplyPartService,
    // Hexagonal architecture repositories
    { provide: WorkOrderRepository, useClass: WorkOrderTypeOrmRepository },
    { provide: OldWorkOrderRepository, useClass: OldWorkOrderTypeOrmRepository },
    {
      provide: CustomerReaderPort,
      useFactory: (customerRepository: CustomerRepository) => {
        return new CustomerReaderAdapter(customerRepository);
      },
      inject: [CustomerRepository],
    },
    {
      provide: VehicleReaderPort,
      useFactory: (findByIdVehicleService: FindVehicleByIdUseCase) => {
        return new VehicleReaderAdapter(findByIdVehicleService);
      },
      inject: [FindVehicleByIdUseCase],
    },
    {
      provide: WorkOrderNotificationPort,
      useFactory: (sendEmailPort: SendEmailNotificationPort) => {
        return new WorkOrderNotificationAdapter(sendEmailPort);
      },
      inject: [SendEmailNotificationPort],
    },
    {
      provide: CreateWorkOrderUseCase,
      useFactory: (
        workOrderRepository: WorkOrderRepository,
        customerReader: CustomerReaderPort,
        vehicleReader: VehicleReaderPort,
        notificationService: WorkOrderNotificationPort,
      ) => {
        return new CreateWorkOrderUseCase(
          workOrderRepository,
          customerReader,
          vehicleReader,
          notificationService,
        );
      },
      inject: [
        WorkOrderRepository,
        CustomerReaderPort,
        VehicleReaderPort,
        WorkOrderNotificationPort,
      ],
    },
    {
      provide: UpdateWorkOrderUseCase,
      useFactory: (
        workOrderRepository: WorkOrderRepository,
        customerReader: CustomerReaderPort,
        vehicleReader: VehicleReaderPort,
        notificationService: WorkOrderNotificationPort,
        newRelic: NewRelicService,
        logger: WinstonLoggerService,
      ) => {
        return new UpdateWorkOrderUseCase(
          workOrderRepository,
          customerReader,
          vehicleReader,
          notificationService,
          newRelic,
          logger,
        );
      },
      inject: [
        WorkOrderRepository,
        CustomerReaderPort,
        VehicleReaderPort,
        WorkOrderNotificationPort,
        NewRelicService,
        WinstonLoggerService,
      ],
    },
    DeleteWorkOrderUseCase,
    GetWorkOrderByIdUseCase,
    GetAllWorkOrdersUseCase,
    GetWorkOrdersByCustomerUseCase,
    GetWorkOrdersByStatusUseCase,
    GetWorkOrdersByVehicleUseCase,
    {
      provide: ApproveWorkOrderUseCase,
      useFactory: (
        workOrderRepository: WorkOrderRepository,
        customerReader: CustomerReaderPort,
        vehicleReader: VehicleReaderPort,
        notificationService: WorkOrderNotificationPort,
      ) => {
        return new ApproveWorkOrderUseCase(
          workOrderRepository,
          customerReader,
          vehicleReader,
          notificationService,
        );
      },
      inject: [
        WorkOrderRepository,
        CustomerReaderPort,
        VehicleReaderPort,
        WorkOrderNotificationPort,
      ],
    },
  ],
  exports: [
    // Legacy services exports
    CreateWorkOrderService,
    CreateWorkOrderWithCustomerIdentificationService,
    UpdateWorkOrderService,
    FindWorkOrderService,
    WorkOrderRepository,
    OldWorkOrderRepository,
    // Use Cases exports
    CreateWorkOrderUseCase,
    UpdateWorkOrderUseCase,
    ApproveWorkOrderUseCase,
    GetWorkOrderByIdUseCase,
    GetAllWorkOrdersUseCase,
  ],
})
export class WorkOrdersModule {}
