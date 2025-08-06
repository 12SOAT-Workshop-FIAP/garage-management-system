//Ele especifica quais campos são esperados, seus tipos e, possivelmente, regras de validação

import { Customer } from '@modules/customers/domain/customer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: "Vehicle's brand", nullable: false })
  @IsNotEmpty()
  @IsString()
  brand!: string;
  @IsNotEmpty() @IsString() model!: string;
  @IsNotEmpty() @IsString() plate!: string;
  @IsNotEmpty() @IsNumber() year!: number;

  // FK da classe cliente
  @IsNotEmpty() @IsNumber() customer!: Customer;
}
