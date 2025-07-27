import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../domain/vehicle.entity';

/**
 * RegisterVehicleDto (DTO de registro de Veículo)
 * Data Transfer Object for registering a vehicle (Veículo).
 */
// export class RegisterVehicleDto {
//   @ApiProperty({ description: "Vehicle's license plate" })
//   @IsString()
//   @Length(7, 10)
//   licensePlate!: string;
// }
export class VehicleResponseDto {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  customer_id: string;
  created_at: Date;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.brand = vehicle.brand;
    this.model = vehicle.model;
    this.plate = vehicle.plate;
    this.year = vehicle.year;
    this.customer_id = vehicle.customer_id;
    this.created_at = vehicle.created_at;
  }
}