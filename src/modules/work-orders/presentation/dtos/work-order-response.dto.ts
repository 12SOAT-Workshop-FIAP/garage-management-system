import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';

/**
 * WorkOrderResponseDto (DTO de resposta de Ordem de Serviço)
 * Data Transfer Object for work order response (Ordem de Serviço).
 */
export class WorkOrderResponseDto {
  @ApiProperty({ description: 'Work order unique identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Customer ID' })
  @Expose()
  customerId!: string;

  @ApiProperty({ description: 'Vehicle ID' })
  @Expose()
  vehicleId!: string;

  @ApiProperty({ description: 'Work order description' })
  @Expose()
  description!: string;

  @ApiProperty({ description: 'Work order status', enum: WorkOrderStatus })
  @Expose()
  status!: WorkOrderStatus;

  @ApiProperty({ description: 'Estimated cost' })
  @Expose()
  estimatedCost!: number;

  @ApiProperty({ description: 'Actual cost', required: false })
  @Expose()
  actualCost?: number;

  @ApiProperty({ description: 'Labor cost', required: false })
  @Expose()
  laborCost?: number;

  @ApiProperty({ description: 'Parts cost', required: false })
  @Expose()
  partsCost?: number;

  @ApiProperty({ description: 'Diagnosis', required: false })
  @Expose()
  diagnosis?: string;

  @ApiProperty({ description: 'Technician notes', required: false })
  @Expose()
  technicianNotes?: string;

  @ApiProperty({ description: 'Customer approval' })
  @Expose()
  customerApproval!: boolean;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @Expose()
  estimatedCompletionDate?: Date;

  @ApiProperty({ description: 'Completion date', required: false })
  @Expose()
  completedAt?: Date;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  @Expose()
  updatedAt!: Date;

  static fromDomain(workOrder: WorkOrder): WorkOrderResponseDto {
    const dto = new WorkOrderResponseDto();
    
    dto.id = workOrder.id.value;
    dto.customerId = workOrder.customerId;
    dto.vehicleId = workOrder.vehicleId;
    dto.description = workOrder.description.value;
    dto.status = workOrder.status;
    dto.estimatedCost = workOrder.estimatedCost.value;
    dto.actualCost = workOrder.actualCost?.value;
    dto.laborCost = workOrder.laborCost?.value;
    dto.partsCost = workOrder.partsCost?.value;
    dto.diagnosis = workOrder.diagnosis?.value;
    dto.technicianNotes = workOrder.technicianNotes?.value;
    dto.customerApproval = workOrder.customerApproval;
    dto.estimatedCompletionDate = workOrder.estimatedCompletionDate;
    dto.completedAt = workOrder.completedAt;
    dto.createdAt = workOrder.createdAt;
    dto.updatedAt = workOrder.updatedAt;

    return dto;
  }
}
