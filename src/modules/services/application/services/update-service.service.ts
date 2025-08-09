import { ServiceRepository } from '../../domain/service.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '../../domain/service.entity';
import { UpdateServiceDto } from '../dtos/update-service.dto';

@Injectable()
export class UpdateServiceService {
  constructor(
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
