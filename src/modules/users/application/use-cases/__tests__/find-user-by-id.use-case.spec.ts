import { FindUserByIdUseCase } from '../find-user-by-id.use-case';
import { FindUserByIdQuery } from '../../queries/find-user-by-id.query';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase;
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

    useCase = new FindUserByIdUseCase(mockRepository);
  });

  it('should find user by id successfully', async () => {
    const query = new FindUserByIdQuery('12345678-1234-1234-1234-123456789012');
    const user = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'hashedpassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(query);

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(result).toBeInstanceOf(User);
    expect(result.id?.value).toBe('12345678-1234-1234-1234-123456789012');
  });

  it('should throw NotFoundException when user not found', async () => {
    const query = new FindUserByIdQuery('non-existent-id');
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(query)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(query)).rejects.toThrow('User with ID non-existent-id not found');

    expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });
});
