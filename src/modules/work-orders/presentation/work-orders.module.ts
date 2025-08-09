import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/work-order.orm';
import { WorkOrderController } from './controllers/work-order.controller';
import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { CreateWorkOrderWithCustomerIdentificationService } from '../application/services/create-work-order-with-customer-identification.service';
import { UpdateWorkOrderService } from '../application/services/update-work-order.service';
import { FindWorkOrderService } from '../application/services/find-work-order.service';
import { WorkOrderTypeOrmRepository } from '../infrastructure/repositories/work-order.typeorm.repository';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { CustomersModule } from '../../customers/presentation/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrderORM]),
    CustomersModule,
  ],
  controllers: [WorkOrderController],
  providers: [
    CreateWorkOrderService,
    CreateWorkOrderWithCustomerIdentificationService,
    UpdateWorkOrderService,
    FindWorkOrderService,
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
