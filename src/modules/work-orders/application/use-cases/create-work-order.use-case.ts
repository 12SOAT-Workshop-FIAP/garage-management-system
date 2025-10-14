import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { CreateWorkOrderCommand } from '../commands/create-work-order.command';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import {
  CustomerReaderPort,
  VehicleReaderPort,
  WorkOrderNotificationPort,
} from '../../domain/ports';

@Injectable()
export class CreateWorkOrderUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly customerReader: CustomerReaderPort,
    private readonly vehicleReader: VehicleReaderPort,
    private readonly notificationService: WorkOrderNotificationPort,
  ) {}

  async execute(command: CreateWorkOrderCommand): Promise<WorkOrder> {
    // Get customer ID from vehicle ID
    const customerId = await this.workOrderRepository.findCustomerByVehicleId(command.vehicleId);
    if (!customerId) {
      throw new NotFoundException('Customer not found for provided vehicle');
    }

    const workOrder = WorkOrder.create({
      customerId: customerId,
      vehicleId: command.vehicleId,
      description: command.description,
      estimatedCost: command.estimatedCost,
      diagnosis: command.diagnosis,
    });

    const createdWorkOrder = await this.workOrderRepository.save(workOrder);

    // 📧 Send creation notification
    await this.sendCreationNotification(createdWorkOrder);

    return createdWorkOrder;
  }

  /**
   * 📧 Send creation notification
   * Private method that orchestrates fetching customer/vehicle data and sending email
   */
  private async sendCreationNotification(workOrder: WorkOrder): Promise<void> {
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
        status: workOrder.status as WorkOrderStatus,
        updatedAt: workOrder.createdAt,
        estimatedCompletion: workOrder.estimatedCompletionDate,
        totalValue: totalCost?.value,
      });

      console.log(`✅ Creation notification sent for work order ${workOrder.id.value}`);
    } catch (error) {
      console.error(
        `❌ Failed to send creation notification for work order ${workOrder.id.value}:`,
        error,
      );
    }
  }
}
