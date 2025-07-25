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
    const vehicle = this.repository.find();
    return vehicle;
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const createdVehicle = this.repository.create(vehicle);
    return await this.repository.save(createdVehicle);
  }
}
