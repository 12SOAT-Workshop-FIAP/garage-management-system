import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrder } from '../domain/work-order.entity';
import { WorkOrderController } from './controllers/work-order.controller';
import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { WorkOrderTypeOrmRepository } from '../infrastructure/repositories/work-order.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder])],
  controllers: [WorkOrderController],
  providers: [
    CreateWorkOrderService,
    { provide: 'WorkOrderRepository', useClass: WorkOrderTypeOrmRepository },
  ],
  exports: [],
})
export class WorkOrdersModule {}
