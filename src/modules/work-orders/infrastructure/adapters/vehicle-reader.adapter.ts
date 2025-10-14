import { VehicleReaderPort, VehicleData } from '../../domain/ports/vehicle-reader.port';
import { FindVehicleByIdUseCase } from '@modules/vehicles/application/use-cases/find-vehicle-by-id.usecase';

export class VehicleReaderAdapter implements VehicleReaderPort {
  constructor(private readonly findByIdVehicleService: FindVehicleByIdUseCase) {}

  async findById(vehicleId: number): Promise<VehicleData | null> {
    try {
      const vehicle = await this.findByIdVehicleService.execute(vehicleId);

      if (!vehicle) {
        return null;
      }

      // 🔄 Transform domain entity to port interface
      return {
        id: vehicle.id?.toString() || vehicleId.toString(),
        brand: vehicle.brand || 'N/A',
        model: vehicle.model || 'N/A',
        plate: vehicle.plate?.value || 'N/A',
      };
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId}:`, error);
      return null;
    }
  }
}
