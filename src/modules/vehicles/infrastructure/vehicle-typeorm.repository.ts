import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly ormRepo: Repository<Vehicle>,
  ) {}

  async create(vehicle: Vehicle): Promise<Vehicle> {
    return await this.ormRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.ormRepo.find();
  }

  async findById(id: number): Promise<Vehicle | null> {
    return await this.ormRepo.findOne({ where: { id }, relations: { customer: true } });
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    return await this.ormRepo.findOne({ where: { plate }, relations: { customer: true } });
  }

  async update(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
    await this.ormRepo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Vehicle not found after update');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
