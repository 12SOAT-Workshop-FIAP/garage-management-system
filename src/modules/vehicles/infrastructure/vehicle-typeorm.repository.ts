import { Injectable } from '@nestjs/common';
import { VehicleEntity } from '@modules/vehicles/infrastructure/vehicle.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle';

@Injectable()
export class VehicleTypeOrmRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly repository: Repository<VehicleEntity>,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    const vehicle = await this.repository.find();
    const domainVehicle = vehicle.map(this.toDomain);
    return domainVehicle;
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const createdVehicle = this.repository.create(vehicle);
    const savedVehicle = await this.repository.save(createdVehicle);
    return this.toDomain(savedVehicle);
  }

  private toDomain(entity: VehicleEntity): Vehicle {
    return new Vehicle(entity);
  }
}
