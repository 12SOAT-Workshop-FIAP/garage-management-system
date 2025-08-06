import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vehicle as VehicleDomain } from '../../domain/vehicle.entity';
import { Vehicle as VehicleEntity } from '../entities/vehicle.entity';
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
    @InjectRepository(VehicleEntity)
    private readonly repository: Repository<VehicleEntity>,
  ) {}

  async findById(id: string): Promise<VehicleDomain | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    
    // Convert TypeORM entity to Domain entity
    return new VehicleDomain({
      licensePlate: entity.licensePlate
    }, entity.id);
  }

  async save(vehicle: VehicleDomain): Promise<VehicleDomain> {
    // Convert Domain entity to TypeORM entity
    const entity = this.repository.create({
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      created_at: vehicle.created_at
    });
    
    const saved = await this.repository.save(entity);
    
    // Convert back to Domain entity
    return new VehicleDomain({
      licensePlate: saved.licensePlate
    }, saved.id);
  }
}
