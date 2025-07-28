import { Injectable, Inject } from '@nestjs/common';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { VehicleRepository } from '../../domain/vehicle.repository';
import { Vehicle } from '../../domain/vehicle.entity';

@Injectable()
export class CreateVehicleService {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepo: VehicleRepository,
  ) {}

  async execute(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new Vehicle();
    // não atribuímos mais `vehicle.id`, o TypeORM fará isso
    vehicle.brand = dto.brand;
    vehicle.model = dto.model;
    vehicle.plate = dto.plate;
    vehicle.year = dto.year;
    vehicle.customer_id = dto.customer_id;
    // created_at também será preenchido pelo @CreateDateColumn - nao preciso definir (ver com Fabricio)
      return this.vehicleRepo.create(vehicle);
  }
}
