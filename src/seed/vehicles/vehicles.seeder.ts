import { Seeder } from '@jorgebodega/typeorm-seeding';
import { VehiclesFactory } from './vehicles.factory';
import { dataSource } from 'ormconfig';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { faker } from '@faker-js/faker';

export default class VehiclesSeeder extends Seeder {
  async run() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const customers = await dataSource.getRepository(CustomerEntity).find();
    if (customers.length === 0) {
      console.warn('No customers found. Skipping vehicles seeding.');
      await dataSource.destroy();
      return;
    }

    const vehicles = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        new VehiclesFactory().create({
          customer: faker.helpers.arrayElement(customers),
        }),
      ),
    );

    console.log(`Created ${vehicles.length} vehicles with customers.`);
    await dataSource.destroy();
  }
}
