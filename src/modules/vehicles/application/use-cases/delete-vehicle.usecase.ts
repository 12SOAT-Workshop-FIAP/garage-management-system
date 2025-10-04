import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { DomainError } from '../../domain/errors/domain-error';

export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepositoryPort) {}

  async execute(id: number): Promise<void> {
    // 1️⃣ Verifica se o veículo existe
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new DomainError('VEHICLE_NOT_FOUND', 'Veículo não encontrado.');
    }

    // 2️⃣ Remove o registro
    await this.vehicleRepository.delete(id);
  }
}
