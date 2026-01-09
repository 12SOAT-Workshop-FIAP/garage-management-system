import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { JwtPayload } from '../../domain/jwt-payload.interface';
import { RefreshTokenPayload } from '../../domain/refresh-token.interface';
import { AuthTokens } from '../../domain/auth-tokens.interface';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '@modules/users/domain/user.entity';

@Injectable()
export class AuthService {
  private readonly refreshTokenStore = new Map<string, RefreshTokenPayload>(); // In-memory store for refresh tokens

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: AuthResponseDto; tokens: AuthTokens }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.status.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password.value);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return user data and tokens
    const userResponse = new AuthResponseDto(
      {
        id: user.id?.value || '',
        name: user.name.value,
        email: user.email.value,
        isActive: user.status.isActive,
      },
      'Login successful',
    );
    return { user: userResponse, tokens };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    // Remove refresh token from memory store if provided
    if (refreshToken) {
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'secret-key-1234',
        }) as RefreshTokenPayload;

        // Remove the specific refresh token
        this.refreshTokenStore.delete(payload.tokenId);
      } catch (error) {
        // Token might be invalid or expired, but we still proceed with logout
      }
    }

    // Remove all refresh tokens for this user (logout from all devices)
    for (const [tokenId, tokenPayload] of this.refreshTokenStore.entries()) {
      if (tokenPayload.sub === userId) {
        this.refreshTokenStore.delete(tokenId);
      }
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'secret-key-1234',
      }) as RefreshTokenPayload;

      // Check if refresh token exists in our store
      const storedToken = this.refreshTokenStore.get(payload.tokenId);
      if (!storedToken || storedToken.sub !== payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user to ensure they still exist and are active
      const user = await this.userRepository.findById(payload.sub);
      if (!user || !user.status.isActive) {
        // Remove invalid refresh token
        this.refreshTokenStore.delete(payload.tokenId);
        throw new UnauthorizedException('User not found or deactivated');
      }

      // Remove old refresh token
      this.refreshTokenStore.delete(payload.tokenId);

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: user.id?.value || '',
    };

    const refreshTokenId = randomUUID();
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id?.value || '',
      tokenId: refreshTokenId,
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'secret-key-1234',
      expiresIn: '900s', // 15 minutes
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'secret-key-1234',
      expiresIn: '7d', // 7 days
    });

    this.refreshTokenStore.set(refreshTokenId, refreshPayload);

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password.value))) {
      return {
        id: user.id?.value,
        name: user.name.value,
        email: user.email.value,
        isActive: user.status.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return null;
  }
}
