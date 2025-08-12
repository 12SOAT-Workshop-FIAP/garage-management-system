import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class FindOneCustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (customer.document) {
      const documentType = customer.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';
      const documentVo = await this.cryptographyService.decryptSensitiveData(
        customer.document,
        documentType,
      );
      customer.document = documentVo.value;
    }
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

    return customer;
  }
}
