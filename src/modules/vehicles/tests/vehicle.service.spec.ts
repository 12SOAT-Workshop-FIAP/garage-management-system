import { RegisterVehicleService } from '../application/services/register-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';

describe('RegisterVehicleService', () => {
  it('should be defined', () => {
    const mockRepository: VehicleRepository = { findById: jest.fn(), save: jest.fn() };
    expect(new RegisterVehicleService(mockRepository)).toBeDefined();
  });
});
