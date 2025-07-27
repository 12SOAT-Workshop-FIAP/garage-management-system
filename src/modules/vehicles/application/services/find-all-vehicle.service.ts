import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from '@modules/vehicles/domain/vehicle.repository';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';

@Injectable()
export class FindVehiclesService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return await this.vehicleRepo.findAll();
  }
}