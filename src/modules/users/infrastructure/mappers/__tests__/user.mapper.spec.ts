import { UserMapper } from '../user.mapper';
import { User } from '../../../domain/user.entity';
import { User as UserEntity } from '../../entities/user.entity';

describe('UserMapper', () => {
  const mockUserEntity = {
    id: '12345678-1234-1234-1234-123456789012',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'hashedpassword',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  const mockDomainUser = User.restore({
    id: '12345678-1234-1234-1234-123456789012',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'hashedpassword',
    status: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  });

  describe('toDomain', () => {
    it('should map infrastructure entity to domain entity', () => {
      const result = UserMapper.toDomain(mockUserEntity as UserEntity);

      expect(result).toBeInstanceOf(User);
      expect(result.id?.value).toBe(mockUserEntity.id);
      expect(result.name.value).toBe(mockUserEntity.name);
      expect(result.email.value).toBe(mockUserEntity.email);
      expect(result.password.value).toBe(mockUserEntity.password);
      expect(result.status.value).toBe(mockUserEntity.isActive);
      expect(result.createdAt).toEqual(mockUserEntity.createdAt);
      expect(result.updatedAt).toEqual(mockUserEntity.updatedAt);
    });

    it('should handle inactive user', () => {
      const inactiveEntity = {
        ...mockUserEntity,
        isActive: false,
      };

      const result = UserMapper.toDomain(inactiveEntity as UserEntity);

      expect(result.status.value).toBe(false);
      expect(result.status.isActive).toBe(false);
      expect(result.status.isInactive).toBe(true);
    });
  });

  describe('toInfrastructure', () => {
    it('should map domain entity to infrastructure entity', () => {
      const result = UserMapper.toInfrastructure(mockDomainUser);

      expect(result).toEqual({
        id: mockDomainUser.id?.value,
        name: mockDomainUser.name.value,
        email: mockDomainUser.email.value,
        password: mockDomainUser.password.value,
        isActive: mockDomainUser.status.value,
      });
    });

    it('should handle user without id', () => {
      const userWithoutId = User.create({
        name: 'New User',
        email: 'new@example.com',
        password: 'password',
      });

      const result = UserMapper.toInfrastructure(userWithoutId);

      expect(result.id).toBe(userWithoutId.id?.value);
      expect(result.name).toBe(userWithoutId.name.value);
      expect(result.email).toBe(userWithoutId.email.value);
      expect(result.password).toBe(userWithoutId.password.value);
      expect(result.isActive).toBe(userWithoutId.status.value);
    });
  });

  describe('toInfrastructureUpdate', () => {
    it('should map domain entity to infrastructure entity for updates', () => {
      const result = UserMapper.toInfrastructureUpdate(mockDomainUser);

      expect(result).toEqual({
        name: mockDomainUser.name.value,
        email: mockDomainUser.email.value,
        password: mockDomainUser.password.value,
        isActive: mockDomainUser.status.value,
        updatedAt: mockDomainUser.updatedAt,
      });
    });

    it('should include updatedAt timestamp', () => {
      const updatedUser = User.restore({
        id: '12345678-1234-1234-1234-123456789012',
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword',
        status: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-03'),
      });

      const result = UserMapper.toInfrastructureUpdate(updatedUser);

      expect(result.updatedAt).toEqual(new Date('2023-01-03'));
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
      expect(result.isActive).toBe(false);
    });
  });
});
