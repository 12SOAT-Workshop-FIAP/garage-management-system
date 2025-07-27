import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

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

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsUUID()
  customer_id?: string;
}