import { Vehicle } from '../../domain/entities/vehicle';
import { Plate } from '../../domain/value-objects/plate';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { DomainError } from '../../domain/errors/domain-error';

interface UpdateVehicleRequest {
  id: number;
  plate?: string;            // se vier, valida formato e duplicidade
  brand?: string;
  model?: string;
  year?: number;
  customerId?: number;       // se vier, valida existência
}

export class UpdateVehicleUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepositoryPort,
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(req: UpdateVehicleRequest): Promise<Vehicle> {
    // 1) Carregar veículo
    const vehicle = await this.vehicleRepository.findById(req.id);
    if (!vehicle) {
      throw new DomainError('VEHICLE_NOT_FOUND', 'Veículo não encontrado.');
    }

    // 2) Troca de owner (se informado)
    if (typeof req.customerId === 'number' && req.customerId !== vehicle.customerId) {
      const exists = await this.customerRepository.existsById(req.customerId);
      if (!exists) throw new DomainError('CUSTOMER_NOT_FOUND', 'Cliente não encontrado.');
      vehicle.changeOwner(req.customerId);
    }

    // 3) Troca de placa (se informada)
    if (typeof req.plate === 'string') {
      const newPlate = Plate.create(req.plate);
      if (newPlate.value !== vehicle.plate.value) {
        const found = await this.vehicleRepository.findByPlate(newPlate);
        if (found && found.id !== vehicle.id) {
          throw new DomainError('PLATE_ALREADY_EXISTS', 'Já existe um veículo com esta placa.');
        }
        vehicle.changePlate(newPlate);
      }
    }

    // 4) Atualizar demais especificações
    const partial: Partial<Omit<Parameters<typeof vehicle.updateSpecs>[0], never>> = {};
    if (typeof req.brand === 'string') partial.brand = req.brand;
    if (typeof req.model === 'string') partial.model = req.model;
    if (typeof req.year === 'number') partial.year = req.year;
    if (Object.keys(partial).length > 0) {
      vehicle.updateSpecs(partial);
    }

    // 5) Persistir
    await this.vehicleRepository.update(vehicle);

    return vehicle;
  }
}
