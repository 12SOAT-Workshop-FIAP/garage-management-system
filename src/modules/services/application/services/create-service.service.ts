import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/service.entity';
import { ServiceRepository } from '../../domain/service.repository';
import { CreateServiceDto } from '../dtos/create-service.dto';

@Injectable()
export class CreateServiceService {
  constructor(
    @Inject('ServiceRepository')
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = new Service({
      name: createServiceDto.name,
      description: createServiceDto.description,
      price: createServiceDto.price,
      active: createServiceDto.active,
      duration: createServiceDto.duration,
    });

    await this.serviceRepository.create(service);

    return service;
  }
}
