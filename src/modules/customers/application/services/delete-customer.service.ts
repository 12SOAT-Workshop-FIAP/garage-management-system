import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';

/**
 * DeleteCustomerService (Serviço de deleção de Cliente)
 * Application service for deleting a customer (Cliente).
 */
@Injectable()
export class DeleteCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
