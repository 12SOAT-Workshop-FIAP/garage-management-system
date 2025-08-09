import { Vehicle } from './vehicle.entity';

/**
 * VehicleRepository
 * Contract for vehicle persistence operations.
 */
export abstract class VehicleRepository {
  abstract save(vehicle: Vehicle): Promise<Vehicle>;
  abstract create(vehicle: Vehicle): Promise<Vehicle>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract findById(id: number): Promise<Vehicle | null>;
  abstract findByPlate(plate: string): Promise<Vehicle | null>;
  abstract findByCustomerId(customerId: number): Promise<Vehicle[]>;
  abstract update(id: number, data: Partial<Vehicle>): Promise<Vehicle>;
  abstract delete(id: number): Promise<void>;
}
