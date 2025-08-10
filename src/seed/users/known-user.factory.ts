import { dataSource } from 'ormconfig';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';

import { User as UserEntity } from '@modules/users/infrastructure/entities/user.entity';
import { type FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { User } from '@modules/users/domain/user.entity';

export class KnownUserFactory extends Factory<UserEntity> {
  protected entity = UserEntity;
  protected dataSource = dataSource;

  protected attrs(): FactorizedAttrs<UserEntity> {
    const userName = faker.person.firstName();
    const userEmail = 'knownuser@fiap.com.br';

    const plainPassword = '@102030@';
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = hashSync(plainPassword, rounds);

    const isActive = true;

    const newUser = new User({
      name: userName,
      email: userEmail,
      password: hashedPassword,
      isActive,
    });

    return newUser;
  }
}
