import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';

@Injectable()
export class FindAllVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepo.findAll();
  }
}
