import { NotFoundException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { UpdateWorkOrderCommand } from '../commands/update-work-order.command';
import { Money } from '../../domain/value-objects/money.value-object';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import {
  CustomerReaderPort,
  VehicleReaderPort,
  WorkOrderNotificationPort,
} from '../../domain/ports';
import { NewRelicService } from '@shared/infrastructure/new-relic.service';
import { WinstonLoggerService } from '@shared/infrastructure/winston-logger.service';

/**
 * 🏗️ UpdateWorkOrderUseCase (Hexagonal Architecture)
 * Application use case for updating work orders with email notifications
 *
 * Dependencies are injected through constructor (ports pattern)
 * No framework-specific decorators on dependencies - pure dependency injection
 */
export class UpdateWorkOrderUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly customerReader: CustomerReaderPort,
    private readonly vehicleReader: VehicleReaderPort,
    private readonly notificationService: WorkOrderNotificationPort,
    private readonly newRelic: NewRelicService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext('UpdateWorkOrderUseCase');
  }

  async execute(command: UpdateWorkOrderCommand): Promise<WorkOrder> {
    const workOrderId = WorkOrderId.create(command.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    const originalStatus = workOrder?.status;
    const statusChangedAt = workOrder?.updatedAt;

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

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Track status change for New Relic dashboards
    if (originalStatus && statusChangedAt && originalStatus !== updatedWorkOrder.status) {
      this.trackStatusChange(
        updatedWorkOrder,
        originalStatus,
        updatedWorkOrder.status,
        statusChangedAt,
      );
      await this.sendStatusChangeNotification(updatedWorkOrder, command.technicianNotes);
    }

    return updatedWorkOrder;
  }

  /**
   * 📧 Send status change notification
   * Private method that orchestrates fetching customer/vehicle data and sending email
   */
  private async sendStatusChangeNotification(
    workOrder: WorkOrder,
    technicianNotes?: string,
  ): Promise<void> {
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
        updatedAt: workOrder.updatedAt,
        estimatedCompletion: workOrder.estimatedCompletionDate,
        totalValue: totalCost.value,
        statusMessage: technicianNotes,
      });

      console.log(`✅ Email notification sent for work order ${workOrder.id.value}`);
    } catch (error) {
      console.error(
        `❌ Failed to send email notification for work order ${workOrder.id.value}:`,
        error,
      );
      // Don't throw - notification failure shouldn't fail the update
    }
  }

  /**
   * 📊 Track status change for New Relic monitoring
   * Records time spent in previous status for dashboard metrics
   */
  private trackStatusChange(
    workOrder: WorkOrder,
    previousStatus: WorkOrderStatus,
    newStatus: WorkOrderStatus,
    statusChangedAt: Date,
  ): void {
    try {
      const now = new Date();
      const timeInPreviousStatusMs = now.getTime() - statusChangedAt.getTime();

      // Record custom event for New Relic dashboards
      this.newRelic.recordEvent('WorkOrderStatusChanged', {
        orderId: workOrder.id.value,
        customerId: workOrder.customerId,
        vehicleId: workOrder.vehicleId,
        previousStatus,
        newStatus,
        timeInPreviousStatusMs,
        timeInPreviousStatusHours: Math.round(timeInPreviousStatusMs / 1000 / 60 / 60 * 100) / 100,
        timestamp: now.toISOString(),
      });

      // Log business event
      this.logger.logBusinessEvent('work_order_status_changed', {
        orderId: workOrder.id.value,
        previousStatus,
        newStatus,
        timeInPreviousStatusMs,
      });

      // Record metric for status transition
      this.newRelic.recordMetric(
        `Custom/WorkOrders/StatusTransition/${previousStatus}_to_${newStatus}`,
        1,
      );

      this.logger.log(
        `Work order status changed: ${previousStatus} → ${newStatus}`,
        undefined,
        {
          orderId: workOrder.id.value,
          timeInPreviousStatusMs,
        },
      );
    } catch (error) {
      this.logger.error(
        'Failed to track status change',
        (error as Error).stack,
        undefined,
        {
          orderId: workOrder.id.value,
          error: (error as Error).message,
        },
      );
    }
  }
}
