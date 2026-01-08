import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { ExternalJwtStrategy } from './infrastructure/strategies/external-jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { ExternalJwtAuthGuard } from './presentation/guards/external-jwt-auth.guard';
import { CpfValidationGuard } from './presentation/guards/cpf-validation.guard';
import { AuthClient } from './infrastructure/clients/auth.client';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        signOptions: { expiresIn: '900s' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ExternalJwtStrategy,
    JwtAuthGuard,
    ExternalJwtAuthGuard,
    CpfValidationGuard,
    AuthClient,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    ExternalJwtAuthGuard,
    CpfValidationGuard,
    JwtStrategy,
    ExternalJwtStrategy,
    AuthClient,
  ],
})
export class AuthModule {}
