import { PartialType } from '@nestjs/swagger';
import { CreatePartDto } from './create-part.dto';
import { IsNumber } from 'class-validator';

export class UpdatePartDto extends PartialType(CreatePartDto) {}

export class UpdateStockDto {
  // delta: positivo (entrada) ou negativo (baixa)
  @IsNumber()
  stockQuantity!: number;
}
