import { PartialType } from '@nestjs/swagger';
import { CreatePartDto } from './create-part.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdatePartDto extends PartialType(CreatePartDto) {}

export class UpdateStockDto {
  @IsNumber()
  @IsPositive()
  stockQuantity!: number;
}
