import { VehicleRepository } from '@modules/vehicles/domain/vehicle.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { Vehicle } from '@modules/vehicles/domain/vehicle';

@Injectable()
export class CreateVehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new Vehicle({ brand: createVehicleDto.brand });
    return await this.vehicleRepository.create(vehicle);
  }
}
