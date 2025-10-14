import { ApiProperty } from '@nestjs/swagger';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderService } from '../../domain/work-order-service.value-object';

/**
 * Response DTO for WorkOrderService
 */
export class WorkOrderServiceResponseDto {
  @ApiProperty({ description: 'Service ID' })
  serviceId!: string;

  @ApiProperty({ description: 'Service name' })
  serviceName!: string;

  @ApiProperty({ description: 'Service description' })
  serviceDescription!: string;

  @ApiProperty({ description: 'Quantity' })
  quantity!: number;

  @ApiProperty({ description: 'Unit price' })
  unitPrice!: number;

  @ApiProperty({ description: 'Total price' })
  totalPrice!: number;

  @ApiProperty({ description: 'Estimated duration in minutes' })
  estimatedDuration!: number;

  @ApiProperty({
    description: 'Service status',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  })
  status!: string;

  @ApiProperty({ description: 'When service was started', required: false })
  startedAt?: Date;

  @ApiProperty({ description: 'When service was completed', required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'Actual duration in minutes', required: false })
  actualDuration?: number;

  @ApiProperty({ description: 'Technician notes', required: false })
  technicianNotes?: string;

  constructor(workOrderService: WorkOrderService) {
    this.serviceId = workOrderService.serviceId;
    this.serviceName = workOrderService.serviceName;
    this.serviceDescription = workOrderService.serviceDescription;
    this.quantity = workOrderService.quantity;
    this.unitPrice = workOrderService.unitPrice;
    this.totalPrice = workOrderService.totalPrice;
    this.estimatedDuration = workOrderService.estimatedDuration;
    this.status = workOrderService.status;
    this.startedAt = workOrderService.startedAt;
    this.completedAt = workOrderService.completedAt;
    this.actualDuration = workOrderService.getActualDuration() ?? undefined;
    this.technicianNotes = workOrderService.technicianNotes;
  }
}

/**
 * Detailed Work Order Response DTO with services
 */
export class WorkOrderDetailedResponseDto {
  @ApiProperty({ description: 'Work order ID' })
  id!: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId!: number;

  @ApiProperty({ description: 'Vehicle ID' })
  vehicleId!: number;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Status' })
  status!: string;

  @ApiProperty({ description: 'Estimated cost' })
  estimatedCost!: number;

  @ApiProperty({ description: 'Actual cost', required: false })
  actualCost?: number;

  @ApiProperty({ description: 'Labor cost', required: false })
  laborCost?: number;

  @ApiProperty({ description: 'Parts cost', required: false })
  partsCost?: number;

  @ApiProperty({ description: 'Diagnosis', required: false })
  diagnosis?: string;

  @ApiProperty({ description: 'Technician notes', required: false })
  technicianNotes?: string;

  @ApiProperty({ description: 'Customer approval', required: false })
  customerApproval?: boolean;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  estimatedCompletionDate?: Date;

  @ApiProperty({ description: 'Completed at', required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Services included in this work order',
    type: [WorkOrderServiceResponseDto],
  })
  services!: WorkOrderServiceResponseDto[];

  @ApiProperty({ description: 'Services summary' })
  servicesSummary!: {
    totalServices: number;
    pendingServices: number;
    inProgressServices: number;
    completedServices: number;
    cancelledServices: number;
    totalServicesCost: number;
    completionPercentage: number;
    estimatedHours: number;
  };

  constructor(workOrder: WorkOrder) {
    this.id = workOrder.id.value;
    this.customerId = workOrder.customerId;
    this.vehicleId = workOrder.vehicleId;
    this.description = workOrder.description.value;
    this.status = workOrder.status;
    this.estimatedCost = workOrder.estimatedCost.value;
    this.actualCost = workOrder.actualCost?.value;
    this.laborCost = workOrder.laborCost?.value;
    this.partsCost = workOrder.partsCost?.value;
    this.diagnosis = workOrder.diagnosis?.value;
    this.technicianNotes = workOrder.technicianNotes?.value;
    this.customerApproval = workOrder.customerApproval;
    this.estimatedCompletionDate = workOrder.estimatedCompletionDate;
    this.completedAt = workOrder.completedAt;
    this.createdAt = workOrder.createdAt;
    this.updatedAt = workOrder.updatedAt;

    this.services = workOrder.services.map((service) => new WorkOrderServiceResponseDto(service));

    this.servicesSummary = {
      totalServices: workOrder.services.length,
      pendingServices: workOrder.getServicesByStatus('PENDING').length,
      inProgressServices: workOrder.getServicesByStatus('IN_PROGRESS').length,
      completedServices: workOrder.getServicesByStatus('COMPLETED').length,
      cancelledServices: workOrder.getServicesByStatus('CANCELLED').length,
      totalServicesCost: workOrder.getTotalServicesCost(),
      completionPercentage: workOrder.getCompletionPercentage(),
      estimatedHours: workOrder.getEstimatedHours(),
    };
  }
}

/**
 * Cost Breakdown Response DTO
 */
export class WorkOrderCostBreakdownResponseDto {
  @ApiProperty({ description: 'Work order ID' })
  workOrderId!: string;

  @ApiProperty({ description: 'Services breakdown', type: [WorkOrderServiceResponseDto] })
  services!: WorkOrderServiceResponseDto[];

  @ApiProperty({ description: 'Cost summary' })
  costSummary!: {
    totalServicesCost: number;
    partsCost: number;
    totalEstimatedCost: number;
    totalActualCost: number;
  };

  constructor(workOrder: WorkOrder) {
    this.workOrderId = workOrder.id.value;
    this.services = workOrder.services.map((service) => new WorkOrderServiceResponseDto(service));

    this.costSummary = {
      totalServicesCost: workOrder.getTotalServicesCost(),
      partsCost: workOrder.partsCost?.value || 0,
      totalEstimatedCost: workOrder.estimatedCost.value,
      totalActualCost: workOrder.actualCost?.value || 0,
    };
  }
}
