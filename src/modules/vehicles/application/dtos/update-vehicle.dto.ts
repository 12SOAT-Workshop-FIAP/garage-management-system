import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

/**
 * UpdateVehicleDto (DTO de atualização de Veículo)
 * Data Transfer Object for updating a vehicle (Veículo).
 */
export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @ApiPropertyOptional({ description: 'Year of the vehicle', example: 2021 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    description: 'ID of the customer to reassign this vehicle to',
    example: 42,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customer?: number;
}
