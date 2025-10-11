import { FindUserByEmailUseCase } from '../find-user-by-email.use-case';
import { FindUserByEmailQuery } from '../../queries/find-user-by-email.query';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindUserByEmailUseCase', () => {
  let useCase: FindUserByEmailUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    useCase = new FindUserByEmailUseCase(mockRepository);
  });

  it('should find user by email successfully', async () => {
    const query = new FindUserByEmailQuery('joao@example.com');
    const user = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'hashedpassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute(query);

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('joao@example.com');
    expect(result).toBeInstanceOf(User);
    expect(result.email.value).toBe('joao@example.com');
  });

  it('should throw NotFoundException when user not found', async () => {
    const query = new FindUserByEmailQuery('nonexistent@example.com');
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(query)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(query)).rejects.toThrow(
      'User with email nonexistent@example.com not found',
    );

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });
});
