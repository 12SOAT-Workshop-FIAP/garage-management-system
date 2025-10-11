import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { UpdateWorkOrderCommand } from '../commands/update-work-order.command';

@Injectable()
export class UpdateWorkOrderUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(command: UpdateWorkOrderCommand): Promise<WorkOrder> {
    const workOrderId = WorkOrderId.create(command.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${command.id} not found`);
    }

    if (command.description) {
      workOrder.updateDescription(command.description);
    }

    if (command.status) {
      workOrder.updateStatus(command.status);
    }

    if (command.diagnosis) {
      workOrder.updateDiagnosis(command.diagnosis);
    }

    if (command.technicianNotes) {
      workOrder.addTechnicianNotes(command.technicianNotes);
    }

    return await this.workOrderRepository.save(workOrder);
  }
}
