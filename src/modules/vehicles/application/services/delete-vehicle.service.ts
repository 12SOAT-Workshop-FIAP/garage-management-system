import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../../domain/vehicle.repository';

@Injectable()
export class DeleteVehicleService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.vehicleRepo.findById(id);
    if (!existing) throw new NotFoundException('Veículo não encontrado no sistema GARAGE');

    await this.vehicleRepo.delete(id);
  }
}
