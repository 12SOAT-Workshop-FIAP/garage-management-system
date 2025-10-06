import { Injectable, Inject } from '@nestjs/common';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { VEHICLE_REPOSITORY } from '../../domain/ports/tokens';
import { DomainError } from '../../domain/errors/domain-error';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    // Verifica se o veículo existe
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new DomainError('VEHICLE_NOT_FOUND', 'Veículo não encontrado.');
    }

    // Remove o registro
    await this.vehicleRepository.delete(id);
  }
}
