import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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

  @ApiProperty({ description: "Year of the vehicle", nullable: false })
  @IsNotEmpty()
  @IsNumber()
  year!: number;

  @ApiProperty({ description: "ID of the customer", nullable: false })
  @IsNotEmpty()
  @IsNumber()
  customer_id!: number;
}
