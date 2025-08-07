import { FindAllVehicleService } from '../application/services/find-all-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';

describe('FindAllVehicleService', () => {
  let service: FindAllVehicleService;
  let vehicleRepo: jest.Mocked<VehicleRepository>;

  beforeEach(() => {
    vehicleRepo = { findAll: jest.fn() } as any;
    service = new FindAllVehicleService(vehicleRepo);
  });

  it('deve retornar todos os veículos', async () => {
    const vehicles: Vehicle[] = [
      {
        id: 1, brand: 'Fiat', model: 'Uno', plate: 'AAA-1234', year: 2010, customer: {} as any, created_at: new Date(),
        customer_id: 0
      }
    ];

    vehicleRepo.findAll.mockResolvedValue(vehicles);

    const result = await service.execute();
    expect(result).toEqual(vehicles);
    expect(vehicleRepo.findAll).toHaveBeenCalled();
  });
});
