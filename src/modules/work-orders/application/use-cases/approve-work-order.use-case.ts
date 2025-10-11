import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { ApproveWorkOrderCommand } from '../commands/approve-work-order.command';

@Injectable()
export class ApproveWorkOrderUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(command: ApproveWorkOrderCommand): Promise<WorkOrder> {
    const workOrderId = WorkOrderId.create(command.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${command.id} not found`);
    }

    workOrder.approveByCustomer();

    return await this.workOrderRepository.save(workOrder);
  }
}
