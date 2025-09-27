import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { DeleteCustomerCommand } from '../commands/delete-customer.command';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findById(command.id);
    if (!customer || !customer.status.isActive) {
      throw new NotFoundException(`Customer with ID ${command.id} not found`);
    }

    if (!customer.canBeDeleted()) {
      throw new Error('Customer cannot be deleted');
    }

    customer.deactivate();

    await this.customerRepository.update(customer, customer);
  }
}
