import { Seeder } from '@jorgebodega/typeorm-seeding';
import { dataSource } from 'ormconfig';
import { PartsFactory } from './parts.factory';

export default class PartsSeeder extends Seeder {
  async run() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const parts = await new PartsFactory().createMany(20);
    console.log(`Created ${parts.length} parts.`);
    await dataSource.destroy();
  }
}
