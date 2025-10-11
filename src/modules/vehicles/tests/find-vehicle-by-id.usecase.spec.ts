/// <reference types="jest" />
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.usecase';
import { VehicleRepositoryPort } from '../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../domain/ports/customer-repository.port';
import { DomainError } from '../domain/errors/domain-error';
import { Vehicle } from '../domain/entities/vehicle';
import { Plate } from '../domain/value-objects/plate';

describe('FindVehicleByIdUseCase', () => {
  const makeRepos = () => {
    const vehicleRepository: jest.Mocked<VehicleRepositoryPort> = {
      findById: jest.fn(),
      findByPlate: jest.fn(),
      findAll: jest.fn(),
      existsByPlate: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const customerRepository: jest.Mocked<CustomerRepositoryPort> = {
      existsById: jest.fn(),
    };
    return { vehicleRepository, customerRepository };
  };

  const makeExisting = () =>
    Vehicle.restore(123, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });

  it('retorna o veículo quando existir', async () => {
    const { vehicleRepository } = makeRepos();
    const sut = new FindVehicleByIdUseCase(vehicleRepository as any);

    const existing = makeExisting();
    vehicleRepository.findById.mockResolvedValue(existing);

    const result = await sut.execute(123);

    expect(vehicleRepository.findById).toHaveBeenCalledWith(123);
    expect(result.id).toBe(123);
    expect(result.plate.value).toBe('ABC1D23');
  });

  it('lança erro quando não encontrar', async () => {
    const { vehicleRepository } = makeRepos();
    const sut = new FindVehicleByIdUseCase(vehicleRepository as any);

    vehicleRepository.findById.mockResolvedValue(null);

    await expect(sut.execute(999)).rejects.toMatchObject<Partial<DomainError>>({
      code: 'VEHICLE_NOT_FOUND',
    });
    expect(vehicleRepository.findById).toHaveBeenCalledWith(999);
  });
});
