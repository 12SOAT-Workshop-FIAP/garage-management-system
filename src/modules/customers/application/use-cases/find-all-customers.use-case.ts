import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { FindAllCustomersQuery } from '../queries/find-all-customers.query';
import { Customer } from '../../domain/entities/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(query: FindAllCustomersQuery): Promise<Customer[]> {
    const customers = await this.customerRepository.findAll();

    if (!customers || customers.length === 0) {
      return [];
    }

    await Promise.all(
      customers.map(async (customer) => {
        await this.decryptCustomerData(customer);
      }),
    );

    return customers;
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
