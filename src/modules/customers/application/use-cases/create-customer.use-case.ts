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
    const customer = Customer.create({
      name: command.name,
      personType: command.personType,
      document: command.document,
      phone: command.phone,
      email: command.email,
    });

    const documentType = customer.document.type;
    const documentVo = await this.cryptographyPort.encryptSensitiveData(
      customer.document.value,
      documentType,
    );

    const customerWithEncryptedDocument = Customer.restore({
      id: 0,
      name: customer.name.value,
      personType: customer.personType.value,
      document: documentVo.encryptedValue,
      phone: customer.phone.value,
      email: customer.email?.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
    });

    return await this.customerRepository.create(customerWithEncryptedDocument);
  }
}
