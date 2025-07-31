import { ServiceRepository } from '../../domain/service.repository';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SERVICE_REPOSITORY } from '../../infrastructure/repositories/service.typeorm.repository';

@Injectable()
export class DeleteServiceService {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.delete(id);
  }
}
