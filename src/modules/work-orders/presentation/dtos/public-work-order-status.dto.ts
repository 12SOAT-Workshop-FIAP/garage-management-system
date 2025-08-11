import { ApiProperty } from '@nestjs/swagger';
import { WorkOrder } from '../../domain/work-order.entity';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';

export class PublicWorkOrderStatusDto {
  @ApiProperty({ description: 'Work order ID' })
  id!: string;

  @ApiProperty({ description: 'Current status of the work order', enum: WorkOrderStatus })
  status!: WorkOrderStatus;

  @ApiProperty({ description: 'Brief description of the work', required: false })
  description?: string;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  estimatedCompletionDate?: Date;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update at' })
  updatedAt!: Date;

  static fromDomain(workOrder: WorkOrder): PublicWorkOrderStatusDto {
    const dto = new PublicWorkOrderStatusDto();
    dto.id = workOrder.id;
    dto.status = workOrder.status;
    dto.description = workOrder.description;
    dto.estimatedCompletionDate = workOrder.estimatedCompletionDate;
    dto.createdAt = workOrder.createdAt;
    dto.updatedAt = workOrder.updatedAt;
    return dto;
  }
}
