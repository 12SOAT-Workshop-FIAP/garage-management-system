import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../../domain/customer.entity';
import { CustomerRepository } from '../../domain/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * CustomerTypeOrmRepository
 * TypeORM implementation for CustomerRepository
 */
@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async save(customer: Customer): Promise<Customer> {
    return this.repository.save(customer);
  }
}
