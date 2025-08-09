import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../presentation/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../presentation/decorators/is-public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: Partial<ExecutionContext>;

    beforeEach(() => {
      mockExecutionContext = {
        getHandler: jest.fn().mockReturnValue({}),
        getClass: jest.fn().mockReturnValue({}),
      };
    });

    it('should return true for public routes', async () => {
      reflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler!(),
        mockExecutionContext.getClass!(),
      ]);
    });

    it('should call parent canActivate for protected routes', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      // Mock the parent's canActivate method
      const parentCanActivate = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(guard)),
        'canActivate',
      );
      parentCanActivate.mockResolvedValue(true);

      await guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler!(),
        mockExecutionContext.getClass!(),
      ]);
      expect(parentCanActivate).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('handleRequest', () => {
    let mockExecutionContext: Partial<ExecutionContext>;
    const mockUser = { id: 'user-123', email: 'test@example.com' };

    beforeEach(() => {
      mockExecutionContext = {
        getHandler: jest.fn().mockReturnValue({}),
        getClass: jest.fn().mockReturnValue({}),
      };
    });

    it('should return user for public routes with authentication', () => {
      reflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.handleRequest(
        null,
        mockUser,
        null,
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(mockUser);
    });

    it('should return user for protected routes with valid authentication', () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      const result = guard.handleRequest(
        null,
        mockUser,
        null,
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(mockUser);
    });

    it('should throw UnauthorizedException for protected routes without user', () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      expect(() => {
        guard.handleRequest(null, null, null, mockExecutionContext as ExecutionContext);
      }).toThrow(new UnauthorizedException('Access token is invalid or expired'));
    });

    it('should throw error for protected routes with error', () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      const error = new Error('Token expired');

      expect(() => {
        guard.handleRequest(error, null, null, mockExecutionContext as ExecutionContext);
      }).toThrow(error);
    });
  });
});
