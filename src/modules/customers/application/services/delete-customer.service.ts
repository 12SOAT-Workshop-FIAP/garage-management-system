import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';

/**
 * DeleteCustomerService (Serviço de deleção de Cliente)
 * Application service for deleting a customer (Cliente).
 */
@Injectable()
export class DeleteCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer || !customer.status) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await this.customerRepository.delete(customer);
  }
}
