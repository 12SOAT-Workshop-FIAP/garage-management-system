import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';
import { Customer } from '@modules/customers/domain/customer';

export class CustomerFactory extends Factory<CustomerEntity> {
  protected entity = CustomerEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<CustomerEntity> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const personType = faker.helpers.arrayElement(['COMPANY', 'INDIVIDUAL']);

    const newCustomer = new Customer({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName: firstName }),
      phone: faker.phone.number(),
      personType: personType,
      document: faker.string.numeric(11),
      status: true,
    });
    return newCustomer as CustomerEntity;
  }
}
