import { Injectable, Inject } from '@nestjs/common';
import { ServiceRepository } from '../../domain/service.repository';
import { Service } from '../../domain/service.entity';
import { SERVICE_REPOSITORY } from '../../infrastructure/repositories/service.typeorm.repository';

@Injectable()
export class FindAllServicesService {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }
}
