import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class FindAllCustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(): Promise<Customer[] | null> {
    const customers = await this.customerRepository.findAll();

    if (customers && customers.length > 0) {
      await Promise.all(
        customers.map(async (customer) => {
          if (!customer.document) return;

          const documentType = customer.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';
          const documentVo = await this.cryptographyService.decryptSensitiveData(
            customer.document,
            documentType,
          );

          customer.document = documentVo.value;
        }),
      );
    }

    return customers;
  }
}
