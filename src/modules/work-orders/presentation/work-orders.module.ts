import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/entities/work-order.entity';
import { WorkOrderServiceORM } from '../infrastructure/entities/work-order-service.entity';
import { WorkOrderController } from './controllers/work-order.controller';
import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { CreateWorkOrderWithCustomerIdentificationService } from '../application/services/create-work-order-with-customer-identification.service';
import { UpdateWorkOrderService } from '../application/services/update-work-order.service';
import { FindWorkOrderService } from '../application/services/find-work-order.service';
import { CreateWorkOrderWithServicesService } from '../application/services/create-work-order-with-services.service';
import { AddServiceToWorkOrderService } from '../application/services/add-service-to-work-order.service';
import { ManageWorkOrderServicesService } from '../application/services/manage-work-order-services.service';
import { WorkOrderTypeOrmRepository } from '../infrastructure/repositories/work-order.typeorm.repository';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { CustomersModule } from '../../customers/presentation/customers.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrderORM, WorkOrderServiceORM]),
    CustomersModule,
    ServicesModule,
  ],
  controllers: [WorkOrderController],
  providers: [
    CreateWorkOrderService,
    CreateWorkOrderWithCustomerIdentificationService,
    UpdateWorkOrderService,
    FindWorkOrderService,
    CreateWorkOrderWithServicesService,
    AddServiceToWorkOrderService,
    ManageWorkOrderServicesService,
    { provide: WorkOrderRepository, useClass: WorkOrderTypeOrmRepository },
  ],
  exports: [
    CreateWorkOrderService,
    CreateWorkOrderWithCustomerIdentificationService,
    UpdateWorkOrderService,
    FindWorkOrderService,
    WorkOrderRepository,
  ],
})
export class WorkOrdersModule {}
