import { Injectable, Inject } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository'; // IMPORTAR sua interface VehicleRepository

@Injectable()
export class FindAllVehicleService {
  constructor(
    @Inject('VehicleRepository') 
    private readonly vehicleRepo: VehicleRepository, 
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepo.findAll(); // Chamar o método findAll da minha interface
  }
}