import { Seeder } from '@jorgebodega/typeorm-seeding';
import { ServiceFactory } from './service.factory';
import { dataSource } from 'ormconfig';

export default class ServiceSeeder extends Seeder {
  async run() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const customers = await new ServiceFactory().createMany(10);
    console.log(`Created ${customers.length} services.`);
    await dataSource.destroy();
  }
}
