import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer as CustomerDomain } from '../../domain/customer.entity';
import { Customer as CustomerEntity } from '../entities/customer.entity';
import { CustomerRepository } from '../../domain/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';

export const CUSTOMER_REPOSITORY = Symbol('CustomerRepository');

/**
 * CustomerTypeOrmRepository
 * TypeORM implementation for CustomerRepository
 */
@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async findById(id: string): Promise<CustomerDomain | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    
    // Convert TypeORM entity to Domain entity
    return new CustomerDomain({
      name: entity.name
    }, entity.id);
  }

  async save(customer: CustomerDomain): Promise<CustomerDomain> {
    // Convert Domain entity to TypeORM entity
    const entity = this.repository.create({
      id: customer.id,
      name: customer.name,
      created_at: customer.created_at
    });
    
    const saved = await this.repository.save(entity);
    
    // Convert back to Domain entity
    return new CustomerDomain({
      name: saved.name
    }, saved.id);
  }
}
