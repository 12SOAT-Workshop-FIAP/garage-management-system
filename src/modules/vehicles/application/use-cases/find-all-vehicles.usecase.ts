import { Injectable, Inject } from '@nestjs/common';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { VEHICLE_REPOSITORY } from '../../domain/ports/tokens';
import { Vehicle } from '../../domain/entities/vehicle';

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepositoryPort,
  ) {}

  async execute(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.findAll();

    // ordenação padrão: created_at DESC
    // como o domínio não conhece infra, assumimos que o repositório retorna
    // objetos com um campo created_at, ou cuidamos aqui se for incluído
    // (por simplicidade, simulamos via toPrimitives().id)
    const sorted = vehicles.sort((a, b) => {
      // se o repositório não tiver created_at, ordena pelo id (maior primeiro)
      const aId = a.id ?? 0;
      const bId = b.id ?? 0;
      return bId - aId;
    });

    return sorted;
  }
}
