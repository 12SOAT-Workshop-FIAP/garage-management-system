import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { RegisterVehicleDto } from '../dtos/register-vehicle.dto';
import { VEHICLE_REPOSITORY } from '@modules/vehicles/infrastructure/repositories/vehicle.typeorm.repository';

/**
 * RegisterVehicleService (Serviço de registro de Veículo)
 * Application service for registering a vehicle (Veículo).
 */
@Injectable()
export class RegisterVehicleService {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(_dto: RegisterVehicleDto) {
    // TODO: Implement vehicle registration logic
    return null;
  }
}
