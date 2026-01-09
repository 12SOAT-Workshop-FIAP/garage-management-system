import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../domain/jwt-payload.interface';
import { AuthClient } from '../clients/auth.client';

@Injectable()
export class ExternalJwtStrategy extends PassportStrategy(Strategy, 'external-jwt') {
  constructor(
    private readonly authClient: AuthClient,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const token = request?.cookies?.['access_token'];
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
      passReqToCallback: true, // Pass request to validate method to access headers
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    // Extract CPF from header if present
    const cpf = request.headers['x-cpf'] as string;
    
    // Extract token from request
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1] || request.cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // Validate token and CPF with auth service
    const user = await this.authClient.validateToken(token, cpf);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    return {
      id: user.userId,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
    };
  }
}
