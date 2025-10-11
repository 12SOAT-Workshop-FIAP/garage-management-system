import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { UpdateWorkOrderDto } from '../dtos/update-work-order.dto';
import { WorkOrder } from '../../domain/work-order.entity';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { WorkOrderEmailNotificationService } from '@modules/email/application/services/work-order-email-notification.service';
import { CustomerRepository } from '@modules/customers/domain/repositories/customer.repository';
import { FindByIdVehicleService } from '@modules/vehicles/application/services/find-by-id-vehicle.service';

/**
 * UpdateWorkOrderService (Serviço de atualização de Ordem de Serviço)
 * Application service for updating a work order.
 */
@Injectable()
export class UpdateWorkOrderService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly workOrderEmailNotificationService: WorkOrderEmailNotificationService,
    private readonly customerRepository: CustomerRepository,
    private readonly findByIdVehicleService: FindByIdVehicleService,
  ) {}

  async execute(id: string, dto: UpdateWorkOrderDto): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findById(id);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    const originalStatus = workOrder.status;

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
      const updatedWorkOrder = await this.workOrderRepository.save(workOrder);

      if (originalStatus !== updatedWorkOrder.status) {
        await this.sendStatusChangeNotification(updatedWorkOrder, dto);
      }

      return updatedWorkOrder;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update work order');
    }
  }

  private async sendStatusChangeNotification(
    workOrder: WorkOrder,
    dto: UpdateWorkOrderDto,
  ): Promise<void> {
    try {
      // Fetch customer data
      const customer = await this.customerRepository.findById(parseInt(workOrder.customerId));
      if (!customer?.email) {
        console.warn(
          `No email found for customer ${workOrder.customerId} in work order ${workOrder.id}`,
        );
        return;
      }

      // Fetch vehicle data
      const vehicle = await this.findByIdVehicleService.execute(parseInt(workOrder.vehicleId));
      if (!vehicle) {
        console.warn(`Vehicle ${workOrder.vehicleId} not found for work order ${workOrder.id}`);
        return;
      }

      // Calculate total cost from work order
      const totalCost = (workOrder.actualCost ?? workOrder.estimatedCost) || 0;

      await this.workOrderEmailNotificationService.sendStatusChangeNotification({
        workOrderId: workOrder.id,
        customerName: customer.name.value,
        customerEmail: customer.email?.value || '',
        vehicleBrand: vehicle.brand || 'N/A',
        vehicleModel: vehicle.model || 'N/A',
        vehiclePlate: vehicle.plate || 'N/A',
        status: workOrder.status,
        updatedAt: workOrder.updatedAt,
        estimatedCompletion: workOrder.estimatedCompletionDate,
        totalValue: totalCost,
        statusMessage: dto.technicianNotes,
      });
    } catch (error) {
      console.error(`Failed to send email notification for work order ${workOrder.id}:`, error);
    }
  }

  private validateStatusTransition(
    currentStatus: WorkOrderStatus,
    newStatus: WorkOrderStatus,
  ): void {
    const validTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      [WorkOrderStatus.RECEIVED]: [WorkOrderStatus.APPROVED, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.APPROVED]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.IN_PROGRESS]: [
        WorkOrderStatus.WAITING_PARTS,
        WorkOrderStatus.PENDING,
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.WAITING_PARTS]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.PENDING]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELLED],
      [WorkOrderStatus.COMPLETED]: [WorkOrderStatus.DELIVERED],
      [WorkOrderStatus.DIAGNOSIS]: [WorkOrderStatus.PENDING],
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
