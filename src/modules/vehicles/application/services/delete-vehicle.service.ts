import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository'; // IMPORTAR minha interface VehicleRepository

@Injectable()
export class DeleteVehicleService {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingVehicle = await this.vehicleRepo.findById(id); // Usar findById da minha interface

    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    await this.vehicleRepo.delete(id); // Chamar delete() da minha interface
  }
}
