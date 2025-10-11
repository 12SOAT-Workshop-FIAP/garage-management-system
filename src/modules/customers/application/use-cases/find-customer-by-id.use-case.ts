import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { FindCustomerByIdQuery } from '../queries/find-customer-by-id.query';
import { Customer } from '../../domain/entities/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';

@Injectable()
export class FindCustomerByIdUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(query: FindCustomerByIdQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(query.id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${query.id} not found`);
    }

    await this.decryptCustomerData(customer);

    return customer;
  }

  private async decryptCustomerData(customer: Customer): Promise<void> {
    if (customer.document) {
      const documentType = customer.document.type;
      const documentVo = await this.cryptographyPort.decryptSensitiveData(
        customer.document.value,
        documentType,
      );

      const decryptedCustomer = Customer.restore({
        id: customer.id?.value || 0,
        name: customer.name.value,
        personType: customer.personType.value,
        document: documentVo.value,
        phone: customer.phone.value,
        email: customer.email?.value,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        status: customer.status.value,
        vehicleIds: customer.vehicleIds,
      });

      Object.assign(customer, decryptedCustomer);
    }
  }
}
