import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/services/auth.service';
import { UserRepository } from '../../users/domain/repositories/user.repository';

import { User } from '../../users/domain/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = User.restore({
    id: 'user-id-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result.user.email).toBe(mockUser.email.value);
      expect(result.tokens.accessToken).toBe('access-token');
      expect(result.tokens.refreshToken).toBe('refresh-token');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password.value);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password.value);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const inactiveUser = User.restore({
        id: 'inactive-user-id',
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'hashedPassword123',
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      userRepository.findByEmail.mockResolvedValue(inactiveUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should successfully logout without refresh token', async () => {
      await expect(service.logout('user-id-123')).resolves.not.toThrow();
    });

    it('should successfully logout with invalid refresh token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.logout('user-id-123', 'invalid-token')).resolves.not.toThrow();
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException for invalid refresh token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user data for valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual({
        id: mockUser.id?.value,
        name: mockUser.name.value,
        email: mockUser.email.value,
        isActive: mockUser.status.isActive,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should return null for invalid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });
  });
});
