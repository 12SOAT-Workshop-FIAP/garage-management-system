import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface AuthServiceUser {
  userId: string;
  email: string;
  name: string | null;
  cpf?: string | null;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  name: string | null;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  name: string | null;
}

@Injectable()
export class AuthClient {
  private readonly logger = new Logger(AuthClient.name);
  private readonly httpClient: AxiosInstance;
  private readonly authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';

    this.httpClient = axios.create({
      baseURL: this.authServiceUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async validateUser(userId: string): Promise<AuthServiceUser | null> {
    try {
      const response = await this.httpClient.get<AuthServiceUser>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to validate user ${userId}:`, error);
      return null;
    }
  }

  async getUserInfo(token: string): Promise<AuthServiceUser | null> {
    try {
      const response = await this.httpClient.get<AuthServiceUser>('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user info:', error);
      return null;
    }
  }

  async validateToken(token: string, cpf?: string): Promise<AuthServiceUser | null> {
    try {
      const headers: any = {
        Authorization: `Bearer ${token}`,
      };

      if (cpf) {
        headers['x-cpf'] = cpf;
      }

      const response = await this.httpClient.get<AuthServiceUser>('/me', { headers });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new UnauthorizedException('Invalid token or CPF mismatch');
      }
      this.logger.error('Failed to validate token:', error);
      return null;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.httpClient.post<LoginResponse>('/login', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid credentials');
      }
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  async register(data: {
    email: string;
    password: string;
    name?: string;
    cpf?: string;
    userId?: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await this.httpClient.post<RegisterResponse>('/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('User already exists');
      }
      this.logger.error('Registration failed:', error);
      throw error;
    }
  }
}
