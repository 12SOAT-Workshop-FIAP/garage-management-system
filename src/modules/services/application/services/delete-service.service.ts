import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../../domain/service.repository';

@Injectable()
export class DeleteServiceService {
  constructor(
    @Inject('ServiceRepository')
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
