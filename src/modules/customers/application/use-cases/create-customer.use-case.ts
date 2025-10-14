import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CreateCustomerCommand } from '../commands/create-customer.command';
import { Customer } from '../../domain/entities/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    // Create domain entity with plain document (validation happens here)
    const customer = Customer.create({
      name: command.name,
      personType: command.personType,
      document: command.document,
      phone: command.phone,
      email: command.email,
    });

    // Repository will handle encryption in the mapper layer before persistence
    return await this.customerRepository.create(customer);
  }
}
