/// <reference types="jest" />
import { DeleteVehicleUseCase } from '../application/use-cases/delete-vehicle.usecase';
import { VehicleRepositoryPort } from '../domain/ports/vehicle-repository.port';
import { DomainError } from '../domain/errors/domain-error';
import { Vehicle } from '../domain/entities/vehicle';
import { Plate } from '../domain/value-objects/plate';

describe('DeleteVehicleUseCase', () => {
  const makeRepo = () => {
    const vehicleRepository: jest.Mocked<VehicleRepositoryPort> = {
      findById: jest.fn(),
      findByPlate: jest.fn(),
      findAll: jest.fn(),
      existsByPlate: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    return vehicleRepository;
  };

  const existing = () =>
    Vehicle.restore(7, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });

  beforeEach(() => jest.resetAllMocks());

  it('deleta quando o veículo existe', async () => {
    const repo = makeRepo();
    const sut = new DeleteVehicleUseCase(repo as any);

    repo.findById.mockResolvedValue(existing());
    repo.delete.mockResolvedValue(undefined);

    await sut.execute(7);

    expect(repo.findById).toHaveBeenCalledWith(7);
    expect(repo.delete).toHaveBeenCalledWith(7);
  });

  it('lança erro quando o veículo não existe', async () => {
    const repo = makeRepo();
    const sut = new DeleteVehicleUseCase(repo as any);

    repo.findById.mockResolvedValue(null);

    await expect(sut.execute(999)).rejects.toMatchObject<Partial<DomainError>>({
      code: 'VEHICLE_NOT_FOUND',
    });
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
