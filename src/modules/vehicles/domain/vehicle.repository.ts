import { Vehicle } from './vehicle.entity';

/**
 * VehicleRepository (Repositório de Veículo)
 * Contract for vehicle persistence operations.
 */
export interface VehicleRepository {
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  save(vehicle: Vehicle): Promise<Vehicle>;
  // TODO: Add other relevant methods
}
