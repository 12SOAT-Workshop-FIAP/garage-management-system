/// <reference types="jest" />
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.usecase';
import { VehicleRepositoryPort } from '../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../domain/ports/customer-repository.port';
import { DomainError } from '../domain/errors/domain-error';
import { Vehicle } from '../domain/entities/vehicle';

describe('CreateVehicleUseCase', () => {
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

  const makeSut = () => {
    const repos = makeRepos();
    const sut = new CreateVehicleUseCase(
      repos.vehicleRepository as any,
      repos.customerRepository as any,
    );
    return { sut, ...repos };
  };

  const validRequest = () => ({
    plate: 'ABC1D23',
    brand: 'Fiat',
    model: 'Punto',
    year: 2018,
    customerId: 1,
  });

  beforeEach(() => jest.resetAllMocks());

  it('cria veículo quando customer existe e placa é única', async () => {
    const { sut, vehicleRepository, customerRepository } = makeSut();
    customerRepository.existsById.mockResolvedValue(true);
    vehicleRepository.existsByPlate.mockResolvedValue(false);
    vehicleRepository.save.mockResolvedValue(42); // ← agora o repo retorna ID

    const result = await sut.execute(validRequest());

    expect(customerRepository.existsById).toHaveBeenCalledWith(1);
    expect(vehicleRepository.existsByPlate).toHaveBeenCalledTimes(1);
    expect(vehicleRepository.save).toHaveBeenCalledTimes(1);

    const saved = vehicleRepository.save.mock.calls[0][0];
    expect(saved).toBeInstanceOf(Vehicle);
    expect(result.id).toBe(42); // ← confere o ID retornado
    expect(result.brand).toBe('Fiat');
    expect(result.model).toBe('Punto');
    expect(result.year).toBe(2018);
    expect(result.customerId).toBe(1);
    expect(result.plate.value).toBe('ABC1D23');
  });

  it('falha se customer não existe', async () => {
    const { sut, vehicleRepository, customerRepository } = makeSut();
    customerRepository.existsById.mockResolvedValue(false);

    await expect(sut.execute(validRequest())).rejects.toMatchObject<Partial<DomainError>>({
      code: 'CUSTOMER_NOT_FOUND',
    });
    expect(vehicleRepository.save).not.toHaveBeenCalled();
  });

  it('falha se placa já existe', async () => {
    const { sut, vehicleRepository, customerRepository } = makeSut();
    customerRepository.existsById.mockResolvedValue(true);
    vehicleRepository.existsByPlate.mockResolvedValue(true);

    await expect(sut.execute(validRequest())).rejects.toMatchObject<Partial<DomainError>>({
      code: 'PLATE_ALREADY_EXISTS',
    });
    expect(vehicleRepository.save).not.toHaveBeenCalled();
  });

  it('falha com placa inválida', async () => {
    const { sut, vehicleRepository, customerRepository } = makeSut();
    customerRepository.existsById.mockResolvedValue(true);
    vehicleRepository.existsByPlate.mockResolvedValue(false);

    const bad = { ...validRequest(), plate: 'INVALIDA' };
    await expect(sut.execute(bad)).rejects.toMatchObject<Partial<DomainError>>({
      code: 'INVALID_PLATE',
    });
    expect(vehicleRepository.save).not.toHaveBeenCalled();
  });
});
