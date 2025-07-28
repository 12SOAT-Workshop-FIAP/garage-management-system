import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty() @IsString() brand!: string;
  @IsNotEmpty() @IsString() model!: string;
  @IsNotEmpty() @IsString() plate!: string;
  @IsNotEmpty() @IsNumber() year!: number;

  // ainda valida UUID aqui
  @IsNotEmpty()
  @IsUUID()
  customer_id!: string;
}
