import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class FindAllVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepo.findAll();

    if (vehicles && vehicles.length > 0) {
      await Promise.all(
        vehicles.map(async (vehicle) => {
          if (!vehicle.plate) return;

          const plateVo = await this.cryptographyService.decryptSensitiveData(
            vehicle.plate,
            'license-plate',
          );

          if (plateVo && plateVo.value) {
            vehicle.plate = plateVo.value;
          }
        }),
      );
    }

    return vehicles;
  }
}
