/// <reference types="jest" />
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.usecase';
import { VehicleRepositoryPort } from '../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../domain/ports/customer-repository.port';
import { DomainError } from '../domain/errors/domain-error';
import { Vehicle } from '../domain/entities/vehicle';
import { Plate } from '../domain/value-objects/plate';

describe('UpdateVehicleUseCase', () => {
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
    Vehicle.restore(10, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });

  const makeSut = () => {
    const repos = makeRepos();
    const sut = new UpdateVehicleUseCase(
      repos.vehicleRepository as any,
      repos.customerRepository as any,
    );
    return { sut, ...repos };
  };

  beforeEach(() => jest.resetAllMocks());

  it('atualiza brand/model/year (sem trocar plate/owner)', async () => {
    const { sut, vehicleRepository } = makeSut();
    const existing = makeExisting();
    vehicleRepository.findById.mockResolvedValue(existing);
    vehicleRepository.update.mockResolvedValue(undefined);

    const result = await sut.execute({
      id: 10,
      brand: 'Fiat',
      model: 'Argo',
      year: 2019,
    });

    expect(vehicleRepository.findById).toHaveBeenCalledWith(10);
    expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
    expect(result.model).toBe('Argo');
    expect(result.year).toBe(2019);
    expect(result.customerId).toBe(1);
    expect(result.plate.value).toBe('ABC1D23');
  });

  it('troca o owner quando customerId válido é informado', async () => {
    const { sut, vehicleRepository, customerRepository } = makeSut();
    const existing = makeExisting();
    vehicleRepository.findById.mockResolvedValue(existing);
    customerRepository.existsById.mockResolvedValue(true);
    vehicleRepository.update.mockResolvedValue(undefined);

    const result = await sut.execute({ id: 10, customerId: 2 });

    expect(customerRepository.existsById).toHaveBeenCalledWith(2);
    expect(result.customerId).toBe(2);
    expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
  });

  it('falha se veículo não existir', async () => {
    const { sut, vehicleRepository } = makeSut();
    vehicleRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({ id: 999, model: 'X' })).rejects.toMatchObject<Partial<DomainError>>({
      code: 'VEHICLE_NOT_FOUND',
    });
    expect(vehicleRepository.update).not.toHaveBeenCalled();
  });

  it('falha se tentar trocar placa para uma já existente em outro veículo', async () => {
    const { sut, vehicleRepository, customerRepository } = makeSut();
    const existing = makeExisting();
    vehicleRepository.findById.mockResolvedValue(existing);
    customerRepository.existsById.mockResolvedValue(true);

    const takenPlate = Plate.create('ZZZ1Z99');
    // simula que a placa pertence a OUTRO veículo (id diferente)
    vehicleRepository.findByPlate.mockResolvedValue(
      Vehicle.restore(99, {
        plate: takenPlate,
        brand: 'VW',
        model: 'Golf',
        year: 2020,
        customerId: 3,
      }),
    );

    await expect(sut.execute({ id: 10, plate: 'ZZZ1Z99' })).rejects.toMatchObject<Partial<DomainError>>({
      code: 'PLATE_ALREADY_EXISTS',
    });
    expect(vehicleRepository.update).not.toHaveBeenCalled();
  });

  it('falha com placa inválida', async () => {
    const { sut, vehicleRepository } = makeSut();
    const existing = makeExisting();
    vehicleRepository.findById.mockResolvedValue(existing);

    await expect(sut.execute({ id: 10, plate: 'XXX-123' })).rejects.toMatchObject<Partial<DomainError>>({
      code: 'INVALID_PLATE',
    });
    expect(vehicleRepository.update).not.toHaveBeenCalled();
  });
});
