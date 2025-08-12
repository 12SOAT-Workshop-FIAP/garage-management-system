import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { Vehicle } from '../../domain/vehicle.entity';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class FindVehicleByPlateService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(plate: string): Promise<Vehicle> {
    if (!this.cryptographyService.validateSensitiveData(plate, 'license-plate')) {
      throw new BadRequestException('Formato ou checksum do documento inválido.');
    }

    const plateVo = await this.cryptographyService.encryptSensitiveData(plate, 'license-plate');
    const encryptedPlate = plateVo.encryptedValue;

    const vehicle = await this.vehicleRepo.findByPlate(encryptedPlate);
    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with license plate ${plateVo.getMaskedValue()} not found`,
      );
    }
    vehicle.plate = plate;

    return vehicle;
  }
}
