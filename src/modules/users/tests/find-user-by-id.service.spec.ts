import { NotFoundException } from '@nestjs/common';
import { FindUserByIdService } from '../application/services/find-user-by-id.service';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

describe('FindUserByIdService', () => {
  let findUserByIdService: FindUserByIdService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    findUserByIdService = new FindUserByIdService(mockUserRepository);
  });

  it('should return user when user exists', async () => {
    const userId = 'test-id';
    const existingUser = new User(
      {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'hashedpassword',
        isActive: true,
      },
      userId,
    );

    mockUserRepository.findById.mockResolvedValue(existingUser);

    const result = await findUserByIdService.execute(userId);

    expect(result).toEqual(existingUser);
    expect(result.id).toBe(userId);
    expect(result.name).toBe('João Silva');
    expect(result.email).toBe('joao@example.com');
    expect(result.isActive).toBe(true);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const userId = 'non-existent-id';

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(findUserByIdService.execute(userId)).rejects.toThrow(NotFoundException);
    await expect(findUserByIdService.execute(userId)).rejects.toThrow(
      `User with id ${userId} not found`,
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(2);
  });
});
