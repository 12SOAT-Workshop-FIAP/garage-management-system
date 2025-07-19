import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * CreateWorkOrderDto (DTO de criação de Ordem de Serviço)
 * Data Transfer Object for creating a work order (Ordem de Serviço).
 */
export class CreateWorkOrderDto {
  @ApiProperty({ description: 'Work order description' })
  @IsString()
  @Length(2, 255)
  description!: string;
}
