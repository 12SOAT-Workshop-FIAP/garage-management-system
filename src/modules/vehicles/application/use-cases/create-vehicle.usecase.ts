import { Injectable, Inject } from '@nestjs/common';
import { Vehicle } from '../../domain/entities/vehicle';
import { Plate } from '../../domain/value-objects/plate';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { DomainError } from '../../domain/errors/domain-error';
import { VEHICLE_REPOSITORY, CUSTOMER_REPOSITORY } from '../../domain/ports/tokens';

interface CreateVehicleRequest {
  plate: string;
  brand: string;
  model: string;
  year: number;
  customerId: number;
}

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepositoryPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(request: CreateVehicleRequest): Promise<Vehicle> {
    const customerExists = await this.customerRepository.existsById(request.customerId);
    if (!customerExists) throw new DomainError('CUSTOMER_NOT_FOUND', 'Cliente não encontrado.');

    const plate = Plate.create(request.plate);
    const plateAlreadyExists = await this.vehicleRepository.existsByPlate(plate);
    if (plateAlreadyExists) throw new DomainError('PLATE_ALREADY_EXISTS', 'Já existe um veículo com esta placa.');

    const vehicle = Vehicle.createNew({
      plate,
      brand: request.brand,
      model: request.model,
      year: request.year,
      customerId: request.customerId,
    });

    await this.vehicleRepository.save(vehicle);
    return vehicle;
  }
}
