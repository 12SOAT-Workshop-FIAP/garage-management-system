import { Vehicle } from './vehicle.entity';

export abstract class VehicleRepository {
  abstract create(vehicle: Vehicle): Promise<Vehicle>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract findByPlate(plate: string): Promise<Vehicle | null>;
  abstract update(id: string, data: Partial<Vehicle>): Promise<Vehicle>;
  abstract delete(id: string): Promise<void>;
}
