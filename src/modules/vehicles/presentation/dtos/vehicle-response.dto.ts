import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * VehicleResponseDto (DTO de resposta de Veículo)
 * Data Transfer Object for vehicle response (Veículo).
 */
export class VehicleResponseDto {
  @ApiProperty({ description: 'Vehicle unique identifier' })
  @Expose()
  id!: number;

  @ApiProperty({ description: "Vehicle's license plate" })
  @Expose()
  brand!: string;
}
