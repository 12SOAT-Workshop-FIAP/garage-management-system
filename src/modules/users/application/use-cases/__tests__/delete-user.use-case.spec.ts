import { DeleteUserUseCase } from '../delete-user.use-case';
import { DeleteUserCommand } from '../../commands/delete-user.command';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
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

    useCase = new DeleteUserUseCase(mockRepository);
  });

  it('should delete a user successfully', async () => {
    const command = new DeleteUserCommand('12345678-1234-1234-1234-123456789012');

    const user = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(user);
    mockRepository.update.mockResolvedValue(user);

    await useCase.execute(command);

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(user.status.isActive).toBe(false);
    expect(mockRepository.update).toHaveBeenCalledWith(user, user);
  });

  it('should throw NotFoundException when user not found', async () => {
    const command = new DeleteUserCommand('non-existent-id');

    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(command)).rejects.toThrow(
      'User with ID non-existent-id not found',
    );

    expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when user is inactive', async () => {
    const command = new DeleteUserCommand('12345678-1234-1234-1234-123456789012');

    const inactiveUser = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'Inactive User',
      email: 'inactive@example.com',
      password: 'password',
      status: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(inactiveUser);

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when user cannot be deleted', async () => {
    const command = new DeleteUserCommand('12345678-1234-1234-1234-123456789012');

    const user = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock canBeDeleted to throw an error
    jest.spyOn(user, 'canBeDeleted').mockImplementation(() => {
      throw new Error('User cannot be deleted');
    });

    mockRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).rejects.toThrow('User cannot be deleted');

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
