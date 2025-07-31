import { Service } from './service.entity';

export interface ServiceRepository {
  create(service: Service): Promise<void>;
  update(service: Service): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service | null>;
}
