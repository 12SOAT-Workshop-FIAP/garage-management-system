import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  brand!: string;

  @IsNotEmpty()
  @IsString()
  model!: string;

  @IsNotEmpty()
  @IsString()
  plate!: string;

  @IsNotEmpty()
  @IsNumber()
  year!: number;

  @IsNotEmpty()
  @IsUUID()
  customer_id!: string;
}