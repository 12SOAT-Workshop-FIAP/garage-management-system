import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '../../domain/service.entity';
import { ServiceRepository } from '../../domain/service.repository';

@Injectable()
export class FindServiceByIdService {
  constructor(
    @Inject('ServiceRepository')
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
