import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: "Vehicle's brand", nullable: false })
  @IsNotEmpty()
  @IsString()
  brand!: string;

  @ApiProperty({ description: "Vehicle's model", nullable: false })
  @IsNotEmpty()
  @IsString()
  model!: string;

  @ApiProperty({ description: "Vehicle's license plate", nullable: false })
  @IsNotEmpty()
  @IsString()
  plate!: string;

  @ApiProperty({ description: 'Year of the vehicle', example: 2021 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  year!: number;

  @ApiProperty({ description: 'ID of the existing customer', example: 42 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  customer!: number;
}
