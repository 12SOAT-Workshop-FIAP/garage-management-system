import { Vehicle } from './vehicle.entity';

export abstract class VehicleRepository {
  abstract create(vehicle: Vehicle): Promise<Vehicle>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract findById(id: number): Promise<Vehicle | null>;
  abstract findByPlate(plate: string): Promise<Vehicle | null>;
  abstract update(id: number, data: Partial<Vehicle>): Promise<Vehicle>;
  abstract delete(id: number): Promise<void>;
}
