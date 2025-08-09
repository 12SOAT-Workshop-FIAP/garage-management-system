import { Service } from './service.entity';

/**
 * ServiceRepository
 * Contract for service persistence operations.
 */
export abstract class ServiceRepository {
  abstract create(service: Service): Promise<void>;
  abstract update(service: Service): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Service[]>;
  abstract findById(id: string): Promise<Service | null>;
}
