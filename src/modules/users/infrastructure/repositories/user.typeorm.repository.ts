import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../../domain/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User as TypeOrmUser } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private readonly repository: Repository<TypeOrmUser>,
  ) {}

  async findAll(): Promise<UserEntity[] | null> {
    const entities = await this.repository.find({
      order: {
        createdAt: 'ASC',
      },
    });
    return entities.map(UserMapper.toDomain);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.repository.findOne({
      where: { email },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const entityData = UserMapper.toInfrastructure(user);
    const entity = this.repository.create(entityData);
    const savedEntity = await this.repository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  async update(oldUser: UserEntity, newUser: UserEntity): Promise<UserEntity | null> {
    const entityData = UserMapper.toInfrastructureUpdate(newUser);
    const result = await this.repository.update(oldUser.id?.value || '', entityData);
    if (result.affected === 0) {
      return null;
    }
    return newUser;
  }

  async delete(user: UserEntity): Promise<void> {
    user.deactivate();
    await this.update(user, user);
  }
}
