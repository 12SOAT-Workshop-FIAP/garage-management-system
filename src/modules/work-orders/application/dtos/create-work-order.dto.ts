import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Length, Min, IsInt, IsArray } from 'class-validator';

/**
 * CreateWorkOrderDto (DTO de criação de Ordem de Serviço)
 * Data Transfer Object for creating a work order (Ordem de Serviço).
 */
export class CreateWorkOrderDto {
  @ApiProperty({ description: 'Vehicle ID', example: 1 })
  @IsInt()
  vehicleId!: number;

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

  @ApiProperty({ 
    description: 'List of service IDs to be performed', 
    required: false,
    type: [String],
    example: ["123e4567-e89b-12d3-a456-426614174000"]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceIds?: string[];

  @ApiProperty({ 
    description: 'List of part IDs to be used', 
    required: false,
    type: [String],
    example: ["987fcdeb-51a2-34c6-d789-102938475610"]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  partIds?: string[];
}
