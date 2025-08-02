import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserService } from '../application/services/update-user.service';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { UpdateUserDto } from '../application/dtos/update-user.dto';

describe('UpdateUserService', () => {
  let updateUserService: UpdateUserService;
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

    updateUserService = new UpdateUserService(mockUserRepository);
  });

  it('should update user successfully', async () => {
    const userId = 'test-id';
    const existingUser = new User(
      {
        name: 'Original Name',
        email: 'original@example.com',
        password: 'originalhashedpassword',
        isActive: true,
      },
      userId,
    );

    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      password: 'newpassword123',
      isActive: false,
    };

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue(undefined);

    const result = await updateUserService.execute(userId, updateUserDto);

    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('updated@example.com');
    expect(result.password).toBe('newpassword123');
    expect(result.isActive).toBe(false);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('updated@example.com');
    expect(mockUserRepository.update).toHaveBeenCalledWith(result);
    expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should update user with partial data', async () => {
    const userId = 'test-id';
    const existingUser = new User(
      {
        name: 'Original Name',
        email: 'original@example.com',
        password: 'originalhashedpassword',
        isActive: true,
      },
      userId,
    );

    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name Only',
    };

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(undefined);

    const result = await updateUserService.execute(userId, updateUserDto);

    expect(result.name).toBe('Updated Name Only');
    expect(result.email).toBe('original@example.com');
    expect(result.password).toBe('originalhashedpassword');
    expect(result.isActive).toBe(true);
    expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const userId = 'non-existent-id';
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(updateUserService.execute(userId, updateUserDto)).rejects.toThrow(
      NotFoundException,
    );
    await expect(updateUserService.execute(userId, updateUserDto)).rejects.toThrow(
      `User with id ${userId} not found`,
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when trying to update to existing email', async () => {
    const userId = 'test-id';
    const existingUser = new User(
      {
        name: 'Original Name',
        email: 'original@example.com',
        password: 'originalhashedpassword',
        isActive: true,
      },
      userId,
    );

    const anotherUser = new User(
      {
        name: 'Another User',
        email: 'taken@example.com',
        password: 'anotherhashedpassword',
        isActive: true,
      },
      'another-id',
    );

    const updateUserDto: UpdateUserDto = {
      email: 'taken@example.com',
    };

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.findByEmail.mockResolvedValue(anotherUser);

    await expect(updateUserService.execute(userId, updateUserDto)).rejects.toThrow(
      ConflictException,
    );
    await expect(updateUserService.execute(userId, updateUserDto)).rejects.toThrow(
      'User with this email already exists',
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('taken@example.com');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should allow updating to same email', async () => {
    const userId = 'test-id';
    const existingUser = new User(
      {
        name: 'Original Name',
        email: 'original@example.com',
        password: 'originalhashedpassword',
        isActive: true,
      },
      userId,
    );

    const updateUserDto: UpdateUserDto = {
      email: 'original@example.com',
      name: 'Updated Name',
    };

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(undefined);

    const result = await updateUserService.execute(userId, updateUserDto);

    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('original@example.com');
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
  });
});
