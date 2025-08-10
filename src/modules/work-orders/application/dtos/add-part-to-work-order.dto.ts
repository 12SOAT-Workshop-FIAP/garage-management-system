import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

/**
 * AddPartToWorkOrderDto
 * DTO para adicionar uma peça a uma ordem de serviço
 */
export class AddPartToWorkOrderDto {
  @ApiProperty({ 
    description: 'Part ID (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  partId!: string;

  @ApiProperty({ 
    description: 'Quantity of parts needed', 
    example: 2,
    minimum: 1,
    maximum: 1000
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  quantity!: number;

  @ApiProperty({ 
    description: 'Unit price override (optional)', 
    example: 150.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiProperty({ 
    description: 'Additional notes about the part usage', 
    example: 'Part needed for brake repair',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
