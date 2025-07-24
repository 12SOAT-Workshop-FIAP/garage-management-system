import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsInt, Min, Max } from 'class-validator';

/**
 * CreateVehicleDto (DTO de criação de Veículo)
 * Data Transfer Object for creating a vehicle (Veículo).
 */
export class CreateVehicleDto {
  // @ApiProperty({ description: "Vehicle's license plate", example: 'ABC-1234' })
  // @IsString()
  // @Length(7, 10)
  // licensePlate!: string;

  @ApiProperty({ description: "Vehicle's brand", example: 'Toyota' })
  @IsString()
  @Length(2, 50)
  brand!: string;

  @ApiProperty({ description: "Vehicle's model", example: 'Corolla' })
  @IsString()
  @Length(1, 50)
  model!: string;

  @ApiProperty({ description: "Vehicle's manufacturing year", example: 2020 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @ApiProperty({ description: "Vehicle's color", example: 'Silver' })
  @IsString()
  @Length(2, 30)
  color!: string;
}
