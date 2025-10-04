import { Vehicle } from '../../domain/entities/vehicle';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { DomainError } from '../../domain/errors/domain-error';

export class FindVehicleByIdUseCase {
  constructor(private readonly vehicleRepository: VehicleRepositoryPort) {}

  async execute(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new DomainError('VEHICLE_NOT_FOUND', 'Veículo não encontrado.');
    }

    return vehicle;
  }
}
