import { Injectable } from '@nestjs/common';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { RegisterVehicleDto } from '../dtos/register-vehicle.dto';

/**
 * RegisterVehicleService (Serviço de registro de Veículo)
 * Application service for registering a vehicle (Veículo).
 */
@Injectable()
export class RegisterVehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(_dto: RegisterVehicleDto) {
    // TODO: Implement vehicle registration logic
    return null;
  }
}
