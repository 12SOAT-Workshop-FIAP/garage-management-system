import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { UpdateWorkOrderDto } from '../dtos/update-work-order.dto';
import { WorkOrder } from '../../domain/work-order.entity';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { WORK_ORDER_REPOSITORY } from '../../infrastructure/repositories/work-order.typeorm.repository';

/**
 * UpdateWorkOrderService (Serviço de atualização de Ordem de Serviço)
 * Application service for updating a work order.
 */
@Injectable()
export class UpdateWorkOrderService {
  constructor(
    @Inject(WORK_ORDER_REPOSITORY)
    private readonly workOrderRepository: WorkOrderRepository,
  ) {}

  async execute(id: string, dto: UpdateWorkOrderDto): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(id);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    try {
      // Update basic fields
      if (dto.description) {
        workOrder.description = dto.description;
      }

      if (dto.diagnosis) {
        workOrder.diagnosis = dto.diagnosis;
      }

      if (dto.technicianNotes) {
        workOrder.addTechnicianNotes(dto.technicianNotes);
      }

      if (dto.estimatedCost !== undefined) {
        workOrder.estimatedCost = dto.estimatedCost;
      }

      if (dto.estimatedCompletionDate) {
        workOrder.estimatedCompletionDate = dto.estimatedCompletionDate;
      }

      // Update costs
      if (dto.laborCost !== undefined || dto.partsCost !== undefined) {
        const laborCost = dto.laborCost ?? workOrder.laborCost ?? 0;
        const partsCost = dto.partsCost ?? workOrder.partsCost ?? 0;
        workOrder.updateCosts(laborCost, partsCost);
      }

      // Handle customer approval
      if (dto.customerApproval === true && workOrder.status === WorkOrderStatus.PENDING) {
        workOrder.approveByCustomer();
      } else if (dto.customerApproval !== undefined) {
        workOrder.customerApproval = dto.customerApproval;
        workOrder.updatedAt = new Date();
      }

      // Update status
      if (dto.status && dto.status !== workOrder.status) {
        this.validateStatusTransition(workOrder.status, dto.status);
        workOrder.updateStatus(dto.status);
      }

      // Save updated work order
      return await this.workOrderRepository.save(workOrder);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update work order');
    }
  }

  private validateStatusTransition(currentStatus: WorkOrderStatus, newStatus: WorkOrderStatus): void {
    const validTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      [WorkOrderStatus.PENDING]: [WorkOrderStatus.APPROVED, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.APPROVED]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.IN_PROGRESS]: [
        WorkOrderStatus.WAITING_PARTS,
        WorkOrderStatus.WAITING_CUSTOMER,
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.WAITING_PARTS]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.WAITING_CUSTOMER]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.COMPLETED]: [WorkOrderStatus.DELIVERED],
      [WorkOrderStatus.CANCELLED]: [],
      [WorkOrderStatus.DELIVERED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
