import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { UserRepository } from '../../users/domain/repositories/user.repository';

import { User } from '../../users/domain/user.entity';
import { JwtPayload } from '../domain/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: jest.Mocked<UserRepository>;
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

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get(UserRepository);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const jwtPayload: JwtPayload = {
      sub: 'user-id-123',
    };

    it('should return user data for valid payload', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(jwtPayload);

      expect(result).toEqual({
        email: mockUser.email.value,
        name: mockUser.name.value,
        id: mockUser.id?.value,
        isActive: mockUser.status.isActive,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(jwtPayload.sub);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(strategy.validate(jwtPayload)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith(jwtPayload.sub);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const inactiveUser = User.restore({
        id: 'inactive-user-id',
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'hashedPassword123',
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      userRepository.findById.mockResolvedValue(inactiveUser);

      await expect(strategy.validate(jwtPayload)).rejects.toThrow(
        new UnauthorizedException('User account is deactivated'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith(jwtPayload.sub);
    });
  });
});
