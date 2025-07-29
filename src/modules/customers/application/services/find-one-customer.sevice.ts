import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';

@Injectable()
export class FindOneCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number): Promise<Customer | null> {
    const customer = await this.customerRepository.findById(id);
    return customer;
  }
}
