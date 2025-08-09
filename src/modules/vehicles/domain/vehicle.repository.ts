import { Vehicle } from './vehicle.entity';

export interface VehicleRepository {
  save(vehicle: Vehicle): Promise<Vehicle>;
  create(vehicle: Vehicle): Promise<Vehicle>;
  findAll(): Promise<Vehicle[]>;
  findById(id: number): Promise<Vehicle | null>;
  findByPlate(plate: string): Promise<Vehicle | null>;
  findByCustomerId(customerId: number): Promise<Vehicle[]>;
  update(id: number, data: Partial<Vehicle>): Promise<Vehicle>;
  delete(id: number): Promise<void>;
}
