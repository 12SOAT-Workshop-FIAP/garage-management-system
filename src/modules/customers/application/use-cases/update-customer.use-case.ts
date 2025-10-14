import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { UpdateCustomerCommand } from '../commands/update-customer.command';
import { Customer } from '../../domain/entities/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(command.id);
    if (!existingCustomer || !existingCustomer.status.isActive) {
      throw new NotFoundException(`Customer with ID ${command.id} not found`);
    }

    if (!existingCustomer.canBeUpdated()) {
      throw new Error('Customer cannot be updated');
    }

    // Create updated domain entity with plain document (validation happens here)
    const updatedCustomer = Customer.restore({
      id: existingCustomer.id?.value || command.id,
      name: command.name || existingCustomer.name.value,
      personType: command.personType || existingCustomer.personType.value,
      document: command.document || existingCustomer.document.value,
      phone: command.phone || existingCustomer.phone.value,
      email: command.email || existingCustomer.email?.value,
      createdAt: existingCustomer.createdAt,
      updatedAt: new Date(),
      status: command.status !== undefined ? command.status : existingCustomer.status.value,
      vehicleIds: existingCustomer.vehicleIds,
    });

    // Repository will handle encryption in the mapper layer before persistence
    const result = await this.customerRepository.update(existingCustomer, updatedCustomer);
    if (!result) {
      throw new Error('Failed to update customer');
    }
    return result;
  }
}
