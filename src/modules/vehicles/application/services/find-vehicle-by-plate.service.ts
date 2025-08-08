import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { Vehicle } from '../../domain/vehicle.entity';
import { LicensePlate } from '@modules/cryptography/domain/value-objects/license-plate.value-object';

@Injectable()
export class FindVehicleByPlateService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(plate: string): Promise<Vehicle> {
    // Validate license plate format
    const licensePlate = new LicensePlate(plate);
    if (!licensePlate.validate()) {
      throw new Error('Invalid license plate format');
    }

    const vehicle = await this.vehicleRepo.findByPlate(plate);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with license plate ${plate} not found`);
    }

    return vehicle;
  }
}
