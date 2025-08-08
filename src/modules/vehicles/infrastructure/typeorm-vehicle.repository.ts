import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly ormRepository: Repository<Vehicle>,
  ) {}

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return await this.ormRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.ormRepository.find({
      relations: ['customer'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return await this.ormRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    // Remove formatting for search (both ABC1234 and ABC-1234 should match)
    const cleanPlate = plate.replace(/[^A-Za-z0-9]/g, '');
    
    return await this.ormRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.customer', 'customer')
      .where('REPLACE(vehicle.plate, \'-\', \'\') = :cleanPlate', { cleanPlate })
      .getOne();
  }

  async findByCustomerId(customerId: string): Promise<Vehicle[]> {
    return await this.ormRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .orderBy('vehicle.created_at', 'DESC')
      .getMany();
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    await this.ormRepository.update(id, data);
    const updatedVehicle = await this.findById(id);
    if (!updatedVehicle) {
      throw new Error(`Vehicle with id ${id} not found`);
    }
    return updatedVehicle;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
