import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { FindAllCustomersQuery } from '../queries/find-all-customers.query';
import { Customer } from '../../domain/entities/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';
import { CustomerMapper } from '@modules/customers/infrastructure/mappers/customer.mapper';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(query: FindAllCustomersQuery): Promise<Customer[]> {
    const customerEntities = await this.customerRepository.findAll();

    if (!customerEntities || customerEntities.length === 0) {
      return [];
    }

    const customers = await Promise.all(
      customerEntities.map(async (entity) => {
        let decryptedDocument = entity.document;

        if (entity.document) {
          const documentVo = await this.cryptographyPort.decryptSensitiveData(
            entity.document,
            entity.personType === 'COMPANY' ? 'cnpj' : 'cpf',
          );
          decryptedDocument = documentVo.value;
        }

        return CustomerMapper.toDomain({
          ...entity,
          document: decryptedDocument,
        });
      }),
    );

    return customers;
  }
}
