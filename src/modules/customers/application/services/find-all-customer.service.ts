import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';

@Injectable()
export class FindAllCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[] | null> {
    const vehicle = await this.customerRepository.findAll();
    return vehicle;
  }
}
