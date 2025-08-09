import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { Vehicle } from '../../domain/vehicle.entity';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';

@Injectable()
export class CreateVehicleService {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepo: VehicleRepository,
    @Inject(CustomerRepository)
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(dto: CreateVehicleDto): Promise<Vehicle> {
    const customer: CustomerEntity | null = await this.customerRepo.findById(dto.customer);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${dto.customer} not found`);
    }
    const vehicle = new Vehicle();
    vehicle.brand = dto.brand;
    vehicle.model = dto.model;
    vehicle.plate = dto.plate;
    vehicle.year = dto.year;
    vehicle.customer = customer;
    return this.vehicleRepo.create(vehicle);
  }
}
