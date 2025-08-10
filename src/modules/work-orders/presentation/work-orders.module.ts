import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/entities/work-order.entity';
import { WorkOrderServiceORM } from '../infrastructure/entities/work-order-service.entity';
import { WorkOrderPartORM } from '../infrastructure/entities/work-order-part.entity';
import { WorkOrderController } from './controllers/work-order.controller';
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
import { WorkOrderTypeOrmRepository } from '../infrastructure/repositories/work-order.typeorm.repository';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { CustomersModule } from '../../customers/presentation/customers.module';
import { ServicesModule } from '../../services/services.module';
import { PartsModule } from '../../parts/parts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrderORM, WorkOrderServiceORM, WorkOrderPartORM]),
    CustomersModule,
    ServicesModule,
    PartsModule,
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
    AddPartToWorkOrderService,
    RemovePartFromWorkOrderService,
    UpdatePartQuantityService,
    ApprovePartService,
    ApplyPartService,
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
