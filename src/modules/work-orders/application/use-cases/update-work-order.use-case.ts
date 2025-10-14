import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { UpdateWorkOrderCommand } from '../commands/update-work-order.command';
import { Money } from '../../domain/value-objects/money.value-object';

@Injectable()
export class UpdateWorkOrderUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(command: UpdateWorkOrderCommand): Promise<WorkOrder> {
    const workOrderId = WorkOrderId.create(command.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${command.id} not found`);
    }

    if (command.description !== undefined) {
      workOrder.updateDescription(command.description);
    }

    if (command.status !== undefined) {
      workOrder.updateStatus(command.status);
    }

    if (command.diagnosis !== undefined) {
      workOrder.updateDiagnosis(command.diagnosis);
    }

    if (command.technicianNotes !== undefined) {
      workOrder.addTechnicianNotes(command.technicianNotes);
    }

    if (command.estimatedCost !== undefined) {
      workOrder.updateEstimatedCostManually(command.estimatedCost);
    }

    if (command.laborCost !== undefined && command.partsCost !== undefined) {
      const laborCostMoney = Money.create(command.laborCost);
      const partsCostMoney = Money.create(command.partsCost);
      workOrder.updateCosts(laborCostMoney, partsCostMoney);
    }

    if (command.customerApproval !== undefined) {
      workOrder.updateCustomerApproval(command.customerApproval);
    }

    if (command.estimatedCompletionDate !== undefined) {
      workOrder.updateEstimatedCompletionDate(command.estimatedCompletionDate);
    }

    return await this.workOrderRepository.save(workOrder);
  }
}
