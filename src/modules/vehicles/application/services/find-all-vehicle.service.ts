import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from '@modules/vehicles/domain/vehicle.repository';
import { Vehicle } from '@modules/vehicles/domain/vehicle';

@Injectable()
export class FindAllVehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(): Promise<Vehicle[]> {
    const vehicle = this.vehicleRepository.findAll();
    return vehicle;
  }
}
