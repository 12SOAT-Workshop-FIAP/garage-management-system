import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * UpdateWorkOrderDto (DTO de atualização de Ordem de Serviço)
 * Data Transfer Object for updating a work order (Ordem de Serviço).
 */
export class UpdateWorkOrderDto {
  @ApiPropertyOptional({
    description: 'Work order status',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  })
  @IsOptional()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @ApiPropertyOptional({ description: 'Optional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
