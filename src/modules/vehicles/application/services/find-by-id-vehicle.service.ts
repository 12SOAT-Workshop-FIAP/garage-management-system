import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository'; // IMPORTAR minha interface VehicleRepository

@Injectable()
export class FindByIdVehicleService {
  constructor(
    @Inject('VehicleRepository') 
    private readonly vehicleRepo: VehicleRepository, 
  ) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findById(id); // Chamar o método findById da minha interface

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    return vehicle;
  }
}