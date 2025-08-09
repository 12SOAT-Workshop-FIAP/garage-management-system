import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { Vehicle } from '../../domain/vehicle.entity';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { LicensePlate } from '@modules/cryptography/domain/value-objects/license-plate.value-object';

@Injectable()
export class CreateVehicleService {
  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(dto: CreateVehicleDto): Promise<Vehicle> {
    // Validate license plate format
    const licensePlate = new LicensePlate(dto.plate);
    if (!licensePlate.validate()) {
      throw new Error('Invalid license plate format');
    }

    // Check if license plate already exists
    const existingVehicle = await this.vehicleRepo.findByPlate(dto.plate);
    if (existingVehicle) {
      throw new ConflictException(`Vehicle with license plate ${dto.plate} already exists`);
    }

    // Validate customer exists
    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${dto.customerId} not found`);
    }

    // Create new vehicle
    const vehicle = new Vehicle();
    vehicle.brand = dto.brand;
    vehicle.model = dto.model;
    vehicle.plate = dto.plate; // Will be formatted in @BeforeInsert
    vehicle.year = dto.year;
    vehicle.customer = customer;

    return await this.vehicleRepo.save(vehicle);
  }
}
