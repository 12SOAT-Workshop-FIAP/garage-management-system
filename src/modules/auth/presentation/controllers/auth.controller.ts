import { Controller, Post, Body, Res, Req, HttpStatus, UseGuards, HttpCode } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { AuthResponseDto } from '../../application/dtos/auth-response.dto';
import { LogoutResponseDto } from '../../application/dtos/logout.dto';
import { IsPublic } from '../decorators/is-public.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { user, tokens } = await this.authService.login(loginDto);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponseDto> {
    const user = request.user as any;
    const refreshToken = request.cookies?.['refresh_token'];

    // Logout user and invalidate tokens
    await this.authService.logout(user.id, refreshToken);

    // Clear cookies
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return new LogoutResponseDto('Logout successful');
  }

  @Post('refresh')
  @IsPublic() // Public endpoint for token refresh
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const refreshToken = request.cookies?.['refresh_token'];

    if (!refreshToken) {
      response.status(HttpStatus.UNAUTHORIZED);
      return { message: 'Refresh token not found' };
    }

    try {
      const tokens = await this.authService.refreshTokens(refreshToken);

      // Set new access token
      response.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
      });

      // Set new refresh token
      response.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      return { message: 'Tokens refreshed successfully' };
    } catch (error) {
      // Clear invalid refresh token
      response.clearCookie('refresh_token', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/',
      });

      response.status(HttpStatus.UNAUTHORIZED);
      return { message: 'Invalid or expired refresh token' };
    }
  }
}
