import { ServiceRepository } from '../../domain/service.repository';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Service } from '../../domain/service.entity';
import { UpdateServiceDto } from '../dtos/update-service.dto';
import { SERVICE_REPOSITORY } from '../../infrastructure/repositories/service.typeorm.repository';

@Injectable()
export class UpdateServiceService {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    Object.assign(service, updateServiceDto);
    service.updatedAt = new Date();

    await this.serviceRepository.update(service);

    return service;
  }
}
