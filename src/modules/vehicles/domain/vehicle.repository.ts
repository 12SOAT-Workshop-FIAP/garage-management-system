import { Vehicle } from './vehicle';

/**
 * VehicleRepository (Repositório de Veículo)
 * Contract for vehicle persistence operations.
 */

export abstract class VehicleRepository {
  abstract findAll(): Promise<Vehicle[]>;
  abstract create(vehicle: Vehicle): Promise<Vehicle>;
  // findById(id: string): Promise<Vehicle | null>;
  // save(vehicle: Vehicle): Promise<Vehicle>;
  // TODO: Add other relevant methods
}
