import { UpdateUserUseCase } from '../update-user.use-case';
import { UpdateUserCommand } from '../../commands/update-user.command';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/user.entity';
import { CryptographyPort } from '../../../domain/ports/cryptography.port';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;
  let mockCryptographyPort: jest.Mocked<CryptographyPort>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    mockCryptographyPort = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    useCase = new UpdateUserUseCase(mockRepository, mockCryptographyPort);
  });

  it('should update a user successfully', async () => {
    const command = new UpdateUserCommand(
      '12345678-1234-1234-1234-123456789012',
      'Updated Name',
      'updated@example.com',
      'newpassword123',
      false,
    );

    const existingUser = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'oldpassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(existingUser);
    mockCryptographyPort.hashPassword.mockResolvedValue('hashednewpassword');
    mockRepository.update.mockResolvedValue(existingUser);

    const result = await useCase.execute(command);

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockCryptographyPort.hashPassword).toHaveBeenCalledWith('newpassword123');
    expect(mockRepository.update).toHaveBeenCalled();
    expect(result).toBeInstanceOf(User);
  });

  it('should update user with partial data', async () => {
    const command = new UpdateUserCommand(
      '12345678-1234-1234-1234-123456789012',
      'Updated Name Only',
    );

    const existingUser = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'oldpassword',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(existingUser);
    mockRepository.update.mockResolvedValue(existingUser);

    const result = await useCase.execute(command);

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockCryptographyPort.hashPassword).not.toHaveBeenCalled();
    expect(mockRepository.update).toHaveBeenCalled();
    expect(result).toBeInstanceOf(User);
  });

  it('should throw NotFoundException when user not found', async () => {
    const command = new UpdateUserCommand('non-existent-id', 'New Name');

    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(command)).rejects.toThrow(
      'User with id non-existent-id not found',
    );

    expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when user is inactive', async () => {
    const command = new UpdateUserCommand('12345678-1234-1234-1234-123456789012', 'New Name');

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

  it('should throw ConflictException when email already exists', async () => {
    const command = new UpdateUserCommand(
      '12345678-1234-1234-1234-123456789012',
      undefined,
      'existing@example.com',
    );

    const existingUser = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userWithEmail = User.restore({
      id: '87654321-4321-4321-4321-210987654321',
      name: 'Other User',
      email: 'existing@example.com',
      password: 'password',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(existingUser);
    mockRepository.findByEmail.mockResolvedValue(userWithEmail);

    await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
    await expect(useCase.execute(command)).rejects.toThrow('User with this email already exists');

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('existing@example.com');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should not check email conflict when email is not being updated', async () => {
    const command = new UpdateUserCommand('12345678-1234-1234-1234-123456789012', 'Updated Name');

    const existingUser = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(existingUser);
    mockRepository.update.mockResolvedValue(existingUser);

    const result = await useCase.execute(command);

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockRepository.update).toHaveBeenCalled();
    expect(result).toBeInstanceOf(User);
  });

  it('should throw error when update fails', async () => {
    const command = new UpdateUserCommand('12345678-1234-1234-1234-123456789012', 'Updated Name');

    const existingUser = User.restore({
      id: '12345678-1234-1234-1234-123456789012',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(existingUser);
    mockRepository.update.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow('Failed to update user');

    expect(mockRepository.findById).toHaveBeenCalledWith('12345678-1234-1234-1234-123456789012');
    expect(mockRepository.update).toHaveBeenCalled();
  });
});
