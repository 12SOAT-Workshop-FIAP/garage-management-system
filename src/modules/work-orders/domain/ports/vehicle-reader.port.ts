export interface VehicleData {
  id: string;
  brand: string;
  model: string;
  plate: string;
}

export abstract class VehicleReaderPort {
  abstract findById(vehicleId: number): Promise<VehicleData | null>;
}
