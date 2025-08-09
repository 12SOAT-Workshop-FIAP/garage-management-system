import { ServiceRepository } from '../../domain/service.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteServiceService {
  constructor(
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
