import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { UserRepository } from '../../users/domain/user.repository';
import { USER_REPOSITORY } from '../../users/infrastructure/repositories/user.typeorm.repository';
import { User } from '../../users/domain/user.entity';
import { JwtPayload } from '../domain/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: jest.Mocked<UserRepository>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = new User(
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      isActive: true,
    },
    'user-id-123',
  );

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
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get(USER_REPOSITORY);
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
        email: mockUser.email,
        name: mockUser.name,
        id: mockUser.id,
        isActive: mockUser.isActive,
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
      const inactiveUser = new User(
        {
          name: 'Inactive User',
          email: 'inactive@example.com',
          password: 'hashedPassword123',
          isActive: false,
        },
        'inactive-user-id',
      );

      userRepository.findById.mockResolvedValue(inactiveUser);

      await expect(strategy.validate(jwtPayload)).rejects.toThrow(
        new UnauthorizedException('User account is deactivated'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith(jwtPayload.sub);
    });
  });
});
