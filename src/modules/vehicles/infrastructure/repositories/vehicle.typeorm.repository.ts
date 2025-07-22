import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { InjectRepository } from '@nestjs/typeorm';

export const VEHICLE_REPOSITORY = Symbol('VehicleRepository');

/**
 * VehicleTypeOrmRepository (Repositório TypeORM de Veículo)
 * TypeORM implementation for VehicleRepository (Veículo).
 */
@Injectable()
export class VehicleTypeOrmRepository implements VehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async findById(id: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { id } });
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return this.repository.save(vehicle);
  }
}
