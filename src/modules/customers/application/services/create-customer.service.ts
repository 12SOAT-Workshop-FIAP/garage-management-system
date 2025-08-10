import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Customer } from '@modules/customers/domain/customer';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

/**
 * CreateCustomerService (Serviço de criação de Cliente)
 * Application service for creating a customer (Cliente).
 */
@Injectable()
export class CreateCustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customerPayload: any = { ...createCustomerDto };

    const documentType = createCustomerDto.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';
    const documentVo = await this.cryptographyService.encryptSensitiveData(
      createCustomerDto.document,
      documentType,
    );

    customerPayload.document = documentVo.encryptedValue;

    const customer = new Customer({ ...customerPayload });
    return await this.customerRepository.create(customer);
  }
}
