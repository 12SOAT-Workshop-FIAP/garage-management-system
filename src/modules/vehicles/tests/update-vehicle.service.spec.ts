import { UpdateVehicleService } from '../application/services/update-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';

describe('UpdateVehicleService', () => {
  let service: UpdateVehicleService;
  let vehicleRepo: jest.Mocked<VehicleRepository>;

  beforeEach(() => {
    vehicleRepo = {
      update: jest.fn(),
      findById: jest.fn(),
    } as any;
    const mockCryptographyService = { decryptSensitiveData: jest.fn() } as any;
    service = new UpdateVehicleService(vehicleRepo, mockCryptographyService);
  });

  it('deve atualizar o veículo corretamente', async () => {
    const existingVehicle: Vehicle = {
      id: 1,
      brand: 'Fiat',
      model: 'Uno',
      plate: 'ABC-1234',
      year: 2010,
      customer: {} as any,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const dto = {
      model: 'Mobi',
      year: 2018,
    };

    vehicleRepo.findById.mockResolvedValue(existingVehicle);
    vehicleRepo.update.mockResolvedValue({
      ...existingVehicle,
      ...dto,
    });

    const result = await service.execute(1, dto);
    expect(result.model).toBe(dto.model);
    expect(result.year).toBe(dto.year);
    expect(vehicleRepo.update).toHaveBeenCalled();
  });
});
