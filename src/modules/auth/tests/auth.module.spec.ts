import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth.module';
import { AuthController } from '../presentation/controllers/auth.controller';
import { AuthService } from '../application/services/auth.service';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from '../presentation/guards/jwt-auth.guard';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
      ],
    })
      .overrideProvider('UserRepository')
      .useValue({
        findByEmail: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
      })
      .compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthController', () => {
    const controller = module.get<AuthController>(AuthController);
    expect(controller).toBeInstanceOf(AuthController);
  });

  it('should provide AuthService', () => {
    const service = module.get<AuthService>(AuthService);
    expect(service).toBeInstanceOf(AuthService);
  });

  it('should provide JwtStrategy', () => {
    const strategy = module.get<JwtStrategy>(JwtStrategy);
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });

  it('should provide JwtAuthGuard', () => {
    const guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });
});

