import { Seeder } from '@jorgebodega/typeorm-seeding';
import { UsersFactory } from './users.factory';
import { dataSource } from 'ormconfig';
import { KnownUserFactory } from './known-user.factory';

export default class UsersSeeder extends Seeder {
  async run() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const users = await new UsersFactory().createMany(10);
    console.log(`Created ${users.length} users.`);

    const knownUser = await new KnownUserFactory().create();
    console.log(`Created knownUser users.`);
    await dataSource.destroy();
  }
}
