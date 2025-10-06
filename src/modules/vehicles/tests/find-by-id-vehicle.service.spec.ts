import { FindByIdVehicleService } from '../application/services/find-by-id-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';

describe('FindByIdVehicleService', () => {
  let service: FindByIdVehicleService;
  let vehicleRepo: jest.Mocked<VehicleRepository>;

  beforeEach(() => {
    vehicleRepo = { findById: jest.fn() } as any;
    const cryptographyService = {} as any;
    service = new FindByIdVehicleService(vehicleRepo, cryptographyService);
  });

  it('deve retornar o veículo pelo ID', async () => {
    const vehicle: Vehicle = {
      id: 1,
      brand: 'Fiat',
      model: 'Uno',
      plate: 'AAA-1234',
      year: 2010,
      customer: {} as any,
      created_at: new Date(),
      updated_at: new Date(),
      // formatLicensePlate removido
      // getLicensePlateType removido
      getMaskedPlate: jest.fn(),
    };

    vehicleRepo.findById.mockResolvedValue(vehicle);

    const result = await service.execute(1);
    expect(result).toEqual(vehicle);
    expect(vehicleRepo.findById).toHaveBeenCalledWith(1);
  });
});

