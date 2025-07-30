import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../domain/vehicle.entity';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';



@Injectable()
export class UpdateVehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly ormRepo: Repository<Vehicle>,
  ) {}

  async execute(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.ormRepo.preload({ id, ...dto });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }
    return this.ormRepo.save(vehicle);
  }
}

