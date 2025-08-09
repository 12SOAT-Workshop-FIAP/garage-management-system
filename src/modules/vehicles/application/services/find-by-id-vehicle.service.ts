import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';

@Injectable()
export class FindByIdVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findById(id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    return vehicle;
  }
}