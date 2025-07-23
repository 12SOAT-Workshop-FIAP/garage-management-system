import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/service.entity';
import { ServiceRepository } from '../../domain/service.repository';

@Injectable()
export class FindAllServicesService {
  constructor(
    @Inject('ServiceRepository')
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }
}
