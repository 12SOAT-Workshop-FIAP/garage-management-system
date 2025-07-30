import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }             from '@nestjs/typeorm';
import { Repository }                   from 'typeorm';
import { Vehicle } from '../../domain/vehicle.entity';



@Injectable()
export class DeleteVehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly ormRepo: Repository<Vehicle>,
  ) {}

  async execute(id: string): Promise<void> {
    const result = await this.ormRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }
  }
}
