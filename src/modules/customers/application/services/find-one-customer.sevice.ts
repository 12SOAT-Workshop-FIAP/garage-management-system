import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';

@Injectable()
export class FindOneCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }
}
