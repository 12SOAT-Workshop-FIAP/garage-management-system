import { DeleteVehicleService } from '../application/services/delete-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';

describe('DeleteVehicleService', () => {
  let service: DeleteVehicleService;
  let vehicleRepo: jest.Mocked<VehicleRepository>;

  beforeEach(() => {
    vehicleRepo = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new DeleteVehicleService(vehicleRepo);
  });

  it('deve deletar o veículo corretamente', async () => {
    const id = 1;
    const vehicle: Vehicle = {
      id: 1,
      brand: 'Fiat',
      model: 'Uno',
      plate: 'ABC-1234',
      year: 2010,
      customer: {} as any,
      created_at: new Date(),
      customer_id: 0
    };

    vehicleRepo.findById.mockResolvedValue(vehicle);
    
    await service.execute(id);
    expect(vehicleRepo.findById).toHaveBeenCalledWith(id);
    expect(vehicleRepo.delete).toHaveBeenCalledWith(id);
  });
});
