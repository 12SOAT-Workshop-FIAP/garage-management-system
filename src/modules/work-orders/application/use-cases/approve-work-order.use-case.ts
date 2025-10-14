import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { ApproveWorkOrderCommand } from '../commands/approve-work-order.command';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import {
  CustomerReaderPort,
  VehicleReaderPort,
  WorkOrderNotificationPort,
} from '../../domain/ports';

@Injectable()
export class ApproveWorkOrderUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly customerReader: CustomerReaderPort,
    private readonly vehicleReader: VehicleReaderPort,
    private readonly notificationService: WorkOrderNotificationPort,
  ) {}

  async execute(command: ApproveWorkOrderCommand): Promise<WorkOrder> {
    const workOrderId = WorkOrderId.create(command.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${command.id} not found`);
    }

    workOrder.approveByCustomer();

    const approvedWorkOrder = await this.workOrderRepository.save(workOrder);

    // 📧 Send approval notification
    await this.sendApprovalNotification(approvedWorkOrder);

    return approvedWorkOrder;
  }

  /**
   * 📧 Send approval notification
   * Private method that orchestrates fetching customer/vehicle data and sending email
   */
  private async sendApprovalNotification(workOrder: WorkOrder): Promise<void> {
    try {
      const customer = await this.customerReader.findById(workOrder.customerId);
      if (!customer?.email) {
        console.warn(
          `⚠️ No email found for customer ${workOrder.customerId} in work order ${workOrder.id.value}`,
        );
        return;
      }

      const vehicle = await this.vehicleReader.findById(workOrder.vehicleId);
      if (!vehicle) {
        console.warn(
          `⚠️ Vehicle ${workOrder.vehicleId} not found for work order ${workOrder.id.value}`,
        );
        return;
      }

      const totalCost = workOrder.actualCost || workOrder.estimatedCost;

      // 📬 Send notification through port
      await this.notificationService.sendStatusChangeNotification({
        workOrderId: workOrder.id.value,
        customerName: customer.name,
        customerEmail: customer.email,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        vehiclePlate: vehicle.plate,
        status: WorkOrderStatus.APPROVED,
        updatedAt: workOrder.updatedAt,
        estimatedCompletion: workOrder.estimatedCompletionDate,
        totalValue: totalCost?.value,
      });

      console.log(`✅ Approval notification sent for work order ${workOrder.id.value}`);
    } catch (error) {
      console.error(
        `❌ Failed to send approval notification for work order ${workOrder.id.value}:`,
        error,
      );
      // Don't throw - notification failure shouldn't fail the approval
    }
  }
}
