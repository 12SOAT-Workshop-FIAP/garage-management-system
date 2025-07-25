import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * WorkOrderResponseDto (DTO de resposta de Ordem de Serviço)
 * Data Transfer Object for work order response (Ordem de Serviço).
 */
export class WorkOrderResponseDto {
  @ApiProperty({ description: 'Work order unique identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Work order description' })
  @Expose()
  description!: string;
}
