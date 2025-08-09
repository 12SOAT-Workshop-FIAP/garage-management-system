import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';

@Injectable()
export class UpdateVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(id: number, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepo.findById(id);

    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    return this.vehicleRepo.update(id, {
      ...dto,
      customer: dto.customer ? ({ id: dto.customer } as CustomerEntity) : undefined,
    }); // Chamar update() da sua interface
  }
}
