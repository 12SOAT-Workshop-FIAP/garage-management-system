import { Seeder } from '@jorgebodega/typeorm-seeding';
import { CustomerFactory } from './customer.factory';
import { dataSource } from 'ormconfig';

export default class CustomerSeeder extends Seeder {
  async run() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const customers = await new CustomerFactory().createMany(10);
    console.log(`Created ${customers.length} customers.`);
    await dataSource.destroy();
  }
}
