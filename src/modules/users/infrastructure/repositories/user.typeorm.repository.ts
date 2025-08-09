import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { User as TypeOrmUser } from '../entities/user.entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private readonly repository: Repository<TypeOrmUser>,
  ) {}

  async create(user: UserEntity): Promise<void> {
    const newUser = this.repository.create(user);
    await this.repository.save(newUser);
  }

  async update(user: UserEntity): Promise<void> {
    await this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.repository.find();
    return users.map((user) => this.toDomain(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return this.toDomain(user);
  }

  private toDomain(user: TypeOrmUser): UserEntity {
    const userEntity = new UserEntity(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        isActive: user.isActive,
      },
      user.id,
    );

    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;

    return userEntity;
  }
}
