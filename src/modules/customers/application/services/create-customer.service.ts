import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Customer } from '@modules/customers/domain/customer';

/**
 * CreateCustomerService (Serviço de criação de Cliente)
 * Application service for creating a customer (Cliente).
 */
@Injectable()
export class CreateCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer({ ...createCustomerDto });
    return await this.customerRepository.create(customer);
  }
}
