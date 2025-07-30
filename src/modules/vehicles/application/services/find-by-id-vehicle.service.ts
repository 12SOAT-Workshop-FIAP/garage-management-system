import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../domain/vehicle.entity'; 

@Injectable()
export class FindByIdVehicleService { 
  constructor(
    @InjectRepository(Vehicle) // Injeta o repositório TypeORM para a entidade Vehicle
    private readonly ormRepo: Repository<Vehicle>,
  ) {}

   async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.ormRepo.findOne({
      where: { id }, // Condição para buscar pelo ID
      relations: ['customer'], // Garante que os dados do cliente também sejam carregados
    });

    if (!vehicle) {
      // Se nenhum veículo for encontrado, lança uma exceção NotFoundException
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    return vehicle;
  }
}