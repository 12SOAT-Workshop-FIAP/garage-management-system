import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/service.repository';
import { Service } from '../../domain/service.entity';

@Injectable()
export class FindAllServicesService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }
}
