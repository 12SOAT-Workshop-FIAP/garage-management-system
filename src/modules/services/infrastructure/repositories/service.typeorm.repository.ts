import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service as ServiceEntity } from '../../domain/service.entity';
import { ServiceRepository } from '../../domain/service.repository';
import { Service as TypeOrmService } from '../entities/service.entity';

@Injectable()
export class ServiceTypeOrmRepository implements ServiceRepository {
  constructor(
    @InjectRepository(TypeOrmService)
    private readonly repository: Repository<TypeOrmService>,
  ) {}

  async create(service: ServiceEntity): Promise<void> {
    const newService = this.repository.create(service);
    await this.repository.save(newService);
  }

  async update(service: ServiceEntity): Promise<void> {
    await this.repository.save(service);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<ServiceEntity[]> {
    const services = await this.repository.find();
    return services.map((service) => this.toDomain(service));
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const service = await this.repository.findOne({ where: { id } });
    if (!service) {
      return null;
    }
    return this.toDomain(service);
  }

  private toDomain(service: TypeOrmService): ServiceEntity {
    const serviceEntity = new ServiceEntity(
      {
        name: service.name,
        description: service.description,
        price: service.price,
        active: service.active,
        duration: service.duration,
      },
      service.id,
    );

    // Re-assigning properties to ensure they are correctly set
    serviceEntity.createdAt = service.createdAt;
    serviceEntity.updatedAt = service.updatedAt;

    return serviceEntity;
  }
}
