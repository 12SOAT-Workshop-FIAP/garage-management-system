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

          if (customer.vehicles && customer.vehicles.length > 0) {
            await Promise.all(
              customer.vehicles.map(async (vehicle) => {
                if (vehicle.plate) {
                  const plateVo = await this.cryptographyService.decryptSensitiveData(
                    vehicle.plate,
                    'license-plate',
                  );
                  vehicle.plate = plateVo.value;
                }
              }),
            );
          }

          customer.document = documentVo.value;
        }),
      );
    }

    return customers;
  }
}
