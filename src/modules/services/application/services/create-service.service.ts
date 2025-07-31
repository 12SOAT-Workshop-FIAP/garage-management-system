import { Injectable, Inject } from '@nestjs/common';
import { ServiceRepository } from '../../domain/service.repository';
import { Service } from '../../domain/service.entity';
import { SERVICE_REPOSITORY } from '../../infrastructure/repositories/service.typeorm.repository';
import { CreateServiceDto } from '../dtos/create-service.dto';

@Injectable()
export class CreateServiceService {
  constructor(
    @Inject(SERVICE_REPOSITORY)
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
