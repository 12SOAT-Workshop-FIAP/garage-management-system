import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/work-order.orm';
import { WorkOrderController } from './controllers/work-order.controller';
import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { UpdateWorkOrderService } from '../application/services/update-work-order.service';
import { FindWorkOrderService } from '../application/services/find-work-order.service';
import {
  WORK_ORDER_REPOSITORY,
  WorkOrderTypeOrmRepository,
} from '../infrastructure/repositories/work-order.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrderORM])],
  controllers: [WorkOrderController],
  providers: [
    CreateWorkOrderService,
    UpdateWorkOrderService,
    FindWorkOrderService,
    { provide: WORK_ORDER_REPOSITORY, useClass: WorkOrderTypeOrmRepository },
  ],
  exports: [
    CreateWorkOrderService,
    UpdateWorkOrderService,
    FindWorkOrderService,
    WORK_ORDER_REPOSITORY,
  ],
})
export class WorkOrdersModule {}
