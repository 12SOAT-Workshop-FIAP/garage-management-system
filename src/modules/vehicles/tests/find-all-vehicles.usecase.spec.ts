/// <reference types="jest" />
import { FindAllVehiclesUseCase } from '../application/use-cases/find-all-vehicles.usecase';
import { VehicleRepositoryPort } from '../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../domain/ports/customer-repository.port';
import { Vehicle } from '../domain/entities/vehicle';
import { Plate } from '../domain/value-objects/plate';

describe('FindAllVehiclesUseCase', () => {
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

  const v = (id: number, plate: string) =>
    Vehicle.restore(id, {
      plate: Plate.create(plate),
      brand: 'Brand',
      model: 'Model',
      year: 2020,
      customerId: 1,
    });

  it('retorna todos ordenados por id desc (fallback do use case)', async () => {
    const { vehicleRepository } = makeRepos();
    const sut = new FindAllVehiclesUseCase(vehicleRepository as any);

    vehicleRepository.findAll.mockResolvedValue([v(1, 'AAA1A11'), v(3, 'CCC1C33'), v(2, 'BBB1B22')]);

    const result = await sut.execute();
    const ids = result.map(r => r.id);

    expect(ids).toEqual([3, 2, 1]); // ordenado desc pelo fallback do use case
    expect(vehicleRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('retorna lista vazia quando não houver veículos', async () => {
    const { vehicleRepository } = makeRepos();
    const sut = new FindAllVehiclesUseCase(vehicleRepository as any);

    vehicleRepository.findAll.mockResolvedValue([]);

    const result = await sut.execute();
    expect(result).toEqual([]);
  });
});
