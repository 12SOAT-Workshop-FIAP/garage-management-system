import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsInt, Min, Max } from 'class-validator';

/**
 * CreateVehicleDto (DTO de criação de Veículo)
 * Data Transfer Object for creating a vehicle (Veículo).
 */
export class CreateVehicleDto {
  @ApiProperty({ description: "Vehicle's brand", example: 'Toyota' })
  @IsString()
  brand!: string;
}
