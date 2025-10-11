import { User as UserEntity } from '../entities/user.entity';
import { User } from '../../domain/user.entity';

/**
 * UserMapper
 * Maps between domain entities and infrastructure entities
 */
export class UserMapper {
  /**
   * Maps from infrastructure entity to domain entity
   */
  static toDomain(entity: UserEntity): User {
    return User.restore({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      status: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Maps from domain entity to infrastructure entity
   */
  static toInfrastructure(domain: User): Partial<UserEntity> {
    return {
      id: domain.id?.value,
      name: domain.name.value,
      email: domain.email.value,
      password: domain.password.value,
      isActive: domain.status.value,
      // Note: createdAt and updatedAt are handled by TypeORM
    };
  }

  /**
   * Maps from domain entity to infrastructure entity for updates
   */
  static toInfrastructureUpdate(domain: User): Partial<UserEntity> {
    return {
      name: domain.name.value,
      email: domain.email.value,
      password: domain.password.value,
      isActive: domain.status.value,
      updatedAt: domain.updatedAt,
    };
  }
}
