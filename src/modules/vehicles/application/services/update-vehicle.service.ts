import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository'; // IMPORTAR minha interface VehicleRepository
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto'; // Meu DTO de atualização

@Injectable()
export class UpdateVehicleService {
  constructor(
    @Inject('VehicleRepository') // interface VehicleRepository
    private readonly vehicleRepo: VehicleRepository, 
  ) {}

  async execute(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepo.findById(id); // Usar findById da minha interface

    if (!existingVehicle) {
        throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    // O método 'update' do VehicleRepository já recebe id e Partial<Vehicle>
    return this.vehicleRepo.update(id, dto); // Chamar update() da sua interface
  }
}