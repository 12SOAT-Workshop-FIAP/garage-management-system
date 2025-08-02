import { ConflictException } from '@nestjs/common';
import { CreateUserService } from '../application/services/create-user.service';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { CreateUserDto } from '../application/dtos/create-user.dto';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
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

    createUserService = new CreateUserService(mockUserRepository);
  });

  it('should create a new user successfully', async () => {
    const createUserDto: CreateUserDto = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password123',
      isActive: true,
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(undefined);

    const result = await createUserService.execute(createUserDto);

    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe(createUserDto.name);
    expect(result.email).toBe(createUserDto.email);
    expect(result.password).toBe(createUserDto.password);
    expect(result.isActive).toBe(createUserDto.isActive);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(mockUserRepository.create).toHaveBeenCalledWith(result);
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException when user with email already exists', async () => {
    const createUserDto: CreateUserDto = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password123',
      isActive: true,
    };

    const existingUser = new User(
      {
        name: 'Existing User',
        email: createUserDto.email,
        password: 'hashedpassword',
        isActive: true,
      },
      'existing-id',
    );

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserService.execute(createUserDto)).rejects.toThrow(ConflictException);
    await expect(createUserService.execute(createUserDto)).rejects.toThrow(
      'User with this email already exists',
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
