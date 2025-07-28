import { Vehicle } from "@modules/vehicles/domain/vehicle.entity";

export class VehicleResponseDto {
  id!: string;
  brand!: string;
  model!: string;
  plate!: string;
  year!: number;
  customer_id!: string;
  created_at!: Date;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.brand = vehicle.brand;
    this.model = vehicle.model;
    this.plate = vehicle.plate;
    this.year = vehicle.year;
    this.customer_id = vehicle.customer_id;  // UUID
    this.created_at = vehicle.created_at;
  }
}
