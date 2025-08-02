import { NotFoundException } from '@nestjs/common';
import { DeleteUserService } from '../application/services/delete-user.service';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

describe('DeleteUserService', () => {
  let deleteUserService: DeleteUserService;
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

    deleteUserService = new DeleteUserService(mockUserRepository);
  });

  it('should delete user successfully when user exists', async () => {
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
    mockUserRepository.delete.mockResolvedValue(undefined);

    await deleteUserService.execute(userId);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const userId = 'non-existent-id';

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserService.execute(userId)).rejects.toThrow(NotFoundException);
    await expect(deleteUserService.execute(userId)).rejects.toThrow(
      `User with id ${userId} not found`,
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
