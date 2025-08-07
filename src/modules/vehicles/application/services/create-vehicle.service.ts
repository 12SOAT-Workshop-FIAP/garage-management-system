import { Injectable, Inject } from '@nestjs/common';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { Vehicle } from '../../domain/vehicle.entity';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';

@Injectable()
export class CreateVehicleService {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new Vehicle();
    vehicle.brand = dto.brand;
    vehicle.model = dto.model;
    vehicle.plate = dto.plate;
    vehicle.year = dto.year;
    vehicle.customer = { id: dto.customer_id } as CustomerEntity; 
    return this.vehicleRepo.create(vehicle);
  }
}
