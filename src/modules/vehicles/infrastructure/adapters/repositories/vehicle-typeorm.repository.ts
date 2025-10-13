import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepositoryPort } from '../../../domain/ports/vehicle-repository.port';
import { VehicleOrmEntity } from '../../entities/vehicle-orm.entity';
import { VehicleMapper } from '../../mappers/vehicle.mapper';
import { Vehicle } from '../../../domain/entities/vehicle';
import { Plate } from '../../../domain/value-objects/plate';

@Injectable()
export class VehicleTypeOrmRepository implements VehicleRepositoryPort {
  constructor(
    @InjectRepository(VehicleOrmEntity)
    private readonly ormRepository: Repository<VehicleOrmEntity>,
  ) {}

  async findById(id: number): Promise<Vehicle | null> {
    const vehicle = await this.ormRepository.findOne({ where: { id } });
    return vehicle ? VehicleMapper.toDomain(vehicle) : null;
  }

  async findByPlate(plate: Plate): Promise<Vehicle | null> {
    const vehicle = await this.ormRepository.findOne({ where: { plate: plate.value } });
    return vehicle ? VehicleMapper.toDomain(vehicle) : null;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.ormRepository.find({
      order: { createdAt: 'DESC' }
    });
    return VehicleMapper.toDomainList(vehicles);
  }

  async existsByPlate(plate: Plate): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { plate: plate.value } });
    return count > 0;
  }

  async save(vehicle: Vehicle): Promise<number> {
    const ormEntity = VehicleMapper.toOrm(vehicle);
    const saved = await this.ormRepository.save(ormEntity);
    return saved.id;
  }

  async update(vehicle: Vehicle): Promise<void> {
    if (!vehicle.id) {
      throw new Error('Cannot update vehicle without ID');
    }
    const ormEntity = VehicleMapper.toOrm(vehicle);
    await this.ormRepository.update(vehicle.id, ormEntity);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
