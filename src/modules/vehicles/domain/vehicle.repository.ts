import { Vehicle } from './vehicle.entity';

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  findByPlate(plate: string): Promise<Vehicle | null>;
  update(id: string, data: Partial<Vehicle>): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}
