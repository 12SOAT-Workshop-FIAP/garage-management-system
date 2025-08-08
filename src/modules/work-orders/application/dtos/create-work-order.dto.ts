import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsNumber, Length, Min } from 'class-validator';

/**
 * CreateWorkOrderDto (DTO de criação de Ordem de Serviço)
 * Data Transfer Object for creating a work order (Ordem de Serviço).
 */
export class CreateWorkOrderDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsUUID()
  customerId!: string;

  @ApiProperty({ description: 'Vehicle ID' })
  @IsUUID()
  vehicleId!: string;

  @ApiProperty({ description: 'Work order description' })
  @IsString()
  @Length(10, 1000)
  description!: string;

  @ApiProperty({ description: 'Initial diagnosis', required: false })
  @IsOptional()
  @IsString()
  @Length(10, 2000)
  diagnosis?: string;

  @ApiProperty({ description: 'Estimated cost', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCost?: number;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsOptional()
  estimatedCompletionDate?: Date;
}
