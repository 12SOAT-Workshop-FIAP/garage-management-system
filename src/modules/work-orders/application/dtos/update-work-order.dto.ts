import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, Length, Min } from 'class-validator';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';

/**
 * UpdateWorkOrderDto (DTO de atualização de Ordem de Serviço)
 * Data Transfer Object for updating a work order.
 */
export class UpdateWorkOrderDto {
  @ApiPropertyOptional({ description: 'Work order description' })
  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Work order status', enum: WorkOrderStatus })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiPropertyOptional({ description: 'Diagnosis' })
  @IsOptional()
  @IsString()
  @Length(10, 2000)
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'Technician notes' })
  @IsOptional()
  @IsString()
  @Length(5, 1000)
  technicianNotes?: string;

  @ApiPropertyOptional({ description: 'Estimated cost' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCost?: number;

  @ApiPropertyOptional({ description: 'Labor cost' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  laborCost?: number;

  @ApiPropertyOptional({ description: 'Parts cost' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  partsCost?: number;

  @ApiPropertyOptional({ description: 'Customer approval' })
  @IsOptional()
  @IsBoolean()
  customerApproval?: boolean;

  @ApiPropertyOptional({ description: 'Estimated completion date' })
  @IsOptional()
  estimatedCompletionDate?: Date;
}
