import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class UpdateVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(id: number, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepo.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    let updatedDto = { ...dto };

    if (dto.plate) {
      const plateVo = await this.cryptographyService.encryptSensitiveData(
        dto.plate,
        'license-plate',
      );

      updatedDto.plate = plateVo.encryptedValue;
    }

    const updated = await this.vehicleRepo.update(id, {
      ...dto,
      customer: dto.customer ? ({ id: dto.customer } as CustomerEntity) : undefined,
    });

    if (!updated) throw new NotFoundException(`Vehicle with ID ${id} not found`);

    if (updated.plate) {
      const plateVo = await this.cryptographyService.decryptSensitiveData(
        updated.plate,
        'license-plate',
      );
      updated.plate = plateVo.value;
    }

    return updated;
  }
}
