import { Vehicle } from '../entities/vehicle';
import { Plate } from '../value-objects/plate';

export interface VehicleRepositoryPort {
  findById(id: number): Promise<Vehicle | null>;
  findByPlate(plate: Plate): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  existsByPlate(plate: Plate): Promise<boolean>;
  save(vehicle: Vehicle): Promise<void>;
  update(vehicle: Vehicle): Promise<void>;
  delete(id: number): Promise<void>;
}
