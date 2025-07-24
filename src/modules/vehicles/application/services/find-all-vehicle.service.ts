import { Injectable } from '@nestjs/common';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindAllVehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repo: Repository<Vehicle>,
  ) {}

  async execute(): Promise<Vehicle[]> {
    const vehicle = this.repo.find();
    return vehicle;
  }
}
