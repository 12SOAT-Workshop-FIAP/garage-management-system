import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { Vehicle } from '../../domain/vehicle.entity';

@Injectable()
export class UpdateVehicleService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existing = await this.vehicleRepo.findById(id);
    if (!existing) throw new NotFoundException('Veículo não encontrado');

    return await this.vehicleRepo.update(id, dto);
  }
}
