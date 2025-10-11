import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { FindCustomerByDocumentQuery } from '../queries/find-customer-by-document.query';
import { Customer } from '../../domain/entities/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';
import { Document } from '../../domain/value-objects/document.vo';

@Injectable()
export class FindCustomerByDocumentUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(query: FindCustomerByDocumentQuery): Promise<Customer> {
    const document = new Document(query.document);

    if (!this.cryptographyPort.validateSensitiveData(document.value, document.type)) {
      throw new BadRequestException('Invalid document format or checksum');
    }

    const documentVo = await this.cryptographyPort.encryptSensitiveData(
      document.value,
      document.type,
    );

    const customer = await this.customerRepository.findByDocument(documentVo.encryptedValue);

    if (!customer) {
      throw new NotFoundException(
        `Customer not found with document: ${documentVo.getMaskedValue()}`,
      );
    }

    await this.decryptCustomerData(customer);

    const decryptedCustomer = Customer.restore({
      id: customer.id?.value || 0,
      name: customer.name.value,
      personType: customer.personType.value,
      document: query.document,
      phone: customer.phone.value,
      email: customer.email?.value,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      status: customer.status.value,
      vehicleIds: customer.vehicleIds,
    });

    return decryptedCustomer;
  }

  private async decryptCustomerData(customer: Customer): Promise<void> {}
}
