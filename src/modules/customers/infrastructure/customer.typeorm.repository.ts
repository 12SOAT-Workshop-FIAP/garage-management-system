import { Injectable, NotFoundException } from '@nestjs/common';
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
      where: { status: true },
      order: {
        id: 'ASC',
      },
      relations: {
        vehicles: true,
      },
    });
    const domainCustomer = customer.map(this.toDomain);
    return domainCustomer;
  }

  async findById(id: number): Promise<Customer | null> {
    const customer = await this.repository.findOne({
      where: { id },
      relations: { vehicles: true },
    });
    return customer ? this.toDomain(customer) : null;
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = await this.repository.findOne({
      where: { document },
      relations: { vehicles: true },
    });
    return customer ? this.toDomain(customer) : null;
  }

  async create(customer: Customer): Promise<Customer> {
    const createdCustomer = this.repository.create(customer);
    const savedCustomer = await this.repository.save(createdCustomer);
    return this.toDomain(savedCustomer);
  }

  async update(oldData: CustomerEntity, newData: UpdateCustomerDto): Promise<Customer> {
    const updated = this.repository.merge(oldData, newData);
    const saved = await this.repository.save(updated);
    return this.toDomain(saved);
  }

  async delete(customer: Customer): Promise<void> {
    await this.update(customer, { status: false });
  }

  private toDomain(entity: CustomerEntity): Customer {
    return new Customer({ ...entity });
  }
}
