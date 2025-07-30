import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerRepository } from '../domain/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@modules/customers/domain/customer';
import { UpdateCustomerDto } from '@modules/customers/application/dtos/update-customer.dto';

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

  async findAll(): Promise<Customer[] | null> {
    const customer = await this.repository.find({
      order: {
        id: 'ASC',
      },
    });
    const domainCustomer = customer.map(this.toDomain);
    return domainCustomer;
  }

  async findById(id: number): Promise<Customer | null> {
    const customer = await this.repository.findOne({ where: { id } });
    return customer ? this.toDomain(customer) : ({} as Customer);
  }

  async create(customer: Customer): Promise<Customer> {
    const createdCustomer = this.repository.create(customer);
    const savedCustomer = await this.repository.save(createdCustomer);
    return this.toDomain(savedCustomer);
  }

  async update(id: number, data: UpdateCustomerDto): Promise<Customer | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return null;

    const updated = this.repository.merge(existing, data);
    const saved = await this.repository.save(updated);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.update(id, { status: false });
  }

  private toDomain(entity: CustomerEntity): Customer {
    return new Customer({ ...entity });
  }
}
