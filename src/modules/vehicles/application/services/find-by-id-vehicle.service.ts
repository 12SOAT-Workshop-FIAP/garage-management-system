import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class FindByIdVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findById(id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    if (vehicle.plate) {
      const plateVo = await this.cryptographyService.decryptSensitiveData(
        vehicle.plate,
        'license-plate',
      );
      if (plateVo && plateVo.value) {
        vehicle.plate = plateVo.value;
      }
    }

    return vehicle;
  }
}
