import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';

@Injectable()
export class DeleteVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existingVehicle = await this.vehicleRepo.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    await this.vehicleRepo.delete(id); // Chamar delete() da minha interface
  }
}
