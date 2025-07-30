import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';

@Injectable()
export class FindByDocumentCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(document: string): Promise<Customer> {
    const customer = await this.customerRepository.findByDocument(document);
    if (!customer) {
      throw new NotFoundException(`Customer with document ${document} not found`);
    }
    return customer;
  }
}
