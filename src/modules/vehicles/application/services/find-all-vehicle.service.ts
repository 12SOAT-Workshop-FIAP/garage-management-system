import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../domain/vehicle.entity';



@Injectable()
export class FindAllVehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly ormRepo: Repository<Vehicle>,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.ormRepo.find({ relations: ['customer'] });
  }
}
