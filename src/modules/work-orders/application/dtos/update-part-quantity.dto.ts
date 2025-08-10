import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

/**
 * UpdatePartQuantityDto
 * DTO para atualizar a quantidade de uma peça na ordem de serviço
 */
export class UpdatePartQuantityDto {
  @ApiProperty({ 
    description: 'New quantity for the part', 
    example: 3,
    minimum: 1,
    maximum: 1000
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  quantity!: number;
}
