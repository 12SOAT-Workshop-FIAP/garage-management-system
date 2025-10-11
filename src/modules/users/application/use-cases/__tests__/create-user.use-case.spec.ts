import { CreateUserUseCase } from '../create-user.use-case';
import { CreateUserCommand } from '../../commands/create-user.command';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/user.entity';
import { CryptographyPort } from '../../../domain/ports/cryptography.port';
import { ConflictException } from '@nestjs/common';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
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

    useCase = new CreateUserUseCase(mockRepository, mockCryptographyPort);
  });

  it('should create a user successfully', async () => {
    const command = new CreateUserCommand('João Silva', 'joao@example.com', 'password123', true);

    mockRepository.findByEmail.mockResolvedValue(null);
    mockCryptographyPort.hashPassword.mockResolvedValue('hashedpassword123');
    mockRepository.create.mockResolvedValue(
      User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'hashedpassword123',
        status: true,
      }),
    );

    const result = await useCase.execute(command);

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('joao@example.com');
    expect(mockCryptographyPort.hashPassword).toHaveBeenCalledWith('password123');
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.any(Object),
        email: expect.any(Object),
        password: expect.any(Object),
        status: expect.any(Object),
      }),
    );
    expect(result).toBeInstanceOf(User);
  });

  it('should throw ConflictException when user with email already exists', async () => {
    const command = new CreateUserCommand('João Silva', 'joao@example.com', 'password123', true);

    const existingUser = User.create({
      name: 'Existing User',
      email: 'joao@example.com',
      password: 'hashedpassword',
      status: true,
    });

    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
    await expect(useCase.execute(command)).rejects.toThrow('User with this email already exists');

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('joao@example.com');
    expect(mockCryptographyPort.hashPassword).not.toHaveBeenCalled();
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should create user with inactive status', async () => {
    const command = new CreateUserCommand('João Silva', 'joao@example.com', 'password123', false);

    mockRepository.findByEmail.mockResolvedValue(null);
    mockCryptographyPort.hashPassword.mockResolvedValue('hashedpassword123');
    mockRepository.create.mockResolvedValue(
      User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'hashedpassword123',
        status: false,
      }),
    );

    const result = await useCase.execute(command);

    expect(result.status.isActive).toBe(false);
  });
});
