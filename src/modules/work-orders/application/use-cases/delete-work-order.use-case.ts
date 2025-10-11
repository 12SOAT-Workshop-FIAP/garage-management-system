import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { DeleteWorkOrderCommand } from '../commands/delete-work-order.command';

@Injectable()
export class DeleteWorkOrderUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(command: DeleteWorkOrderCommand): Promise<void> {
    const workOrderId = WorkOrderId.create(command.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${command.id} not found`);
    }

    await this.workOrderRepository.delete(workOrderId);
  }
}
