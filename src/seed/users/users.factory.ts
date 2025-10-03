import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';

import { User as UserEntity } from '@modules/users/infrastructure/entities/user.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { User } from '@modules/users/domain/user.entity';

export class UsersFactory extends Factory<UserEntity> {
  protected entity = UserEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<UserEntity> {
    const userName = faker.person.firstName();
    const userEmail = faker.internet.email({ firstName: userName });

    const plainPassword = faker.internet.password({ length: 8 });
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = hashSync(plainPassword, rounds);

    const isActive = faker.number.int({ min: 1, max: 100 }) <= 90;

    return {
      name: userName,
      email: userEmail,
      password: hashedPassword,
      isActive,
    };
  }
}
