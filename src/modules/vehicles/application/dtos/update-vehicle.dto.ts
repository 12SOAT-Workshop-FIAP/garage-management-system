import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsInt, Min, Max, IsOptional } from 'class-validator';

/**
 * UpdateVehicleDto (DTO de atualização de Veículo)
 * Data Transfer Object for updating a vehicle (Veículo).
 */
export class UpdateVehicleDto {
  @ApiPropertyOptional({ description: "Vehicle's brand", example: 'Toyota' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  brand?: string;

  @ApiPropertyOptional({ description: "Vehicle's model", example: 'Corolla' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  model?: string;

  @ApiPropertyOptional({ description: "Vehicle's manufacturing year", example: 2020 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiPropertyOptional({ description: "Vehicle's color", example: 'Silver' })
  @IsOptional()
  @IsString()
  @Length(2, 30)
  color?: string;
}
