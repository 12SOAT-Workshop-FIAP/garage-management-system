import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';
import { CryptographyRepository } from '@modules/cryptography/infrastructure/repositories/cryptography.repository';

export class CustomerFactory extends Factory<CustomerEntity> {
  protected entity = CustomerEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<CustomerEntity> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const personType = faker.helpers.arrayElement(['COMPANY', 'INDIVIDUAL']);
    const genereatedDocument =
      personType === 'INDIVIDUAL' ? cpf.generate(false) : cnpj.generate(false);

    const phone = faker.helpers.replaceSymbols('(##) 9####-####');

    return {
      name: personType === 'INDIVIDUAL' ? `${firstName} ${lastName}` : faker.company.name(),
      email: faker.internet.email({ firstName }),
      phone: phone,
      personType,
      document: genereatedDocument,
      status: true,
    };
  }

  async createMany(amount: number): Promise<CustomerEntity[]> {
    const customers: CustomerEntity[] = [];
    const cryptoRepository = new CryptographyRepository();
    const cryptographyService = new CryptographyService(cryptoRepository);

    for (let i = 0; i < amount; i++) {
      const customer = await super.make();
      const documentVo = await cryptographyService.encryptSensitiveData(
        customer.document,
        customer.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj',
      );
      customer.document = documentVo.encryptedValue;
      await this.dataSource.getRepository(CustomerEntity).save(customer);
      customers.push(customer);
    }

    return customers;
  }
}
