import { VehicleRepository } from '@modules/vehicles/domain/vehicle.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateVehicleService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new Vehicle();
    vehicle.id = uuidv4();
    vehicle.brand = dto.brand;
    vehicle.model = dto.model;
    vehicle.plate = dto.plate;
    vehicle.year = dto.year;
    vehicle.customer_id = dto.customer_id;
    vehicle.created_at = new Date();

    return await this.vehicleRepo.create(vehicle);
  }
}