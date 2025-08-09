import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../../domain/service.repository';
import { Service } from '../../domain/service.entity';

@Injectable()
export class FindServiceByIdService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }
}
