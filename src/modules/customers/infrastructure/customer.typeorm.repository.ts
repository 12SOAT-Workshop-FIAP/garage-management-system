import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerRepository } from '../domain/repositories/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@modules/customers/domain/entities/customer.entity';
import { CustomerMapper } from './mappers/customer.mapper';

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async findAll(): Promise<CustomerEntity[] | null> {
    const entities = await this.repository.find({
      where: { status: true },
      order: {
        id: 'ASC',
      },
    });
    // return entities.map(CustomerMapper.toDomain);
    return entities;
  }

  async findById(id: number): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { document },
    });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async create(customer: Customer): Promise<Customer> {
    const entityData = CustomerMapper.toInfrastructure(customer);
    const entity = this.repository.create(entityData);
    const savedEntity = await this.repository.save(entity);
    return CustomerMapper.toDomain(savedEntity);
  }

  async update(oldCustomer: Customer, newCustomer: Customer): Promise<Customer | null> {
    const entityData = CustomerMapper.toInfrastructureUpdate(newCustomer);
    const result = await this.repository.update(oldCustomer.id?.value || 0, entityData);
    if (result.affected === 0) {
      return null;
    }
    return newCustomer;
  }

  async delete(customer: Customer): Promise<void> {
    customer.deactivate();
    await this.update(customer, customer);
  }
}
