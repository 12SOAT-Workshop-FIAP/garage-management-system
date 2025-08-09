import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from '../../auth.module';
import { UsersModule } from '../../../users/users.module';
import { User } from '../../../users/infrastructure/entities/user.entity';

function getCookie(cookiesHeader: string | string[] | undefined, name: string): string | undefined {
  if (!cookiesHeader) return undefined;
  const cookiesArray = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
  if (cookiesArray.length === 0) return undefined;
  const cookie = cookiesArray.find((c) => c.startsWith(`${name}=`));
  return cookie ? cookie.split(';')[0] : undefined;
}

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let server: any;

  const testUser = {
    name: 'Auth Test User',
    email: 'auth_e2e@example.com',
    password: 'password123',
  };

  let accessCookie: string | undefined;
  let refreshCookie: string | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should create a user and login successfully, setting cookies', async () => {
      // Create user (public endpoint)
      await request(server)
        .post('/users')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(testUser.email);
        });

      // Login
      const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('id');
      expect(loginResponse.body).toHaveProperty('email', testUser.email);
      expect(loginResponse.body).toHaveProperty('name');
      expect(loginResponse.body).toHaveProperty('isActive');
      expect(loginResponse.body).toHaveProperty('message');

      const setCookies = loginResponse.headers['set-cookie'] as string | string[] | undefined;
      expect(setCookies).toBeDefined();
      accessCookie = getCookie(setCookies, 'access_token');
      refreshCookie = getCookie(setCookies, 'refresh_token');
      expect(accessCookie).toBeDefined();
      expect(refreshCookie).toBeDefined();
    });

    it('should reject invalid credentials', () => {
      return request(server)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpass' })
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return 401 when refresh token is missing', async () => {
      const res = await request(server).post('/auth/refresh').expect(401);
      expect(res.body).toHaveProperty('message');
    });

    it('should refresh tokens when valid refresh token cookie is provided', async () => {
      const res = await request(server)
        .post('/auth/refresh')
        .set('Cookie', [refreshCookie!])
        .expect(200);

      const setCookies = res.headers['set-cookie'] as string | string[] | undefined;
      expect(setCookies).toBeDefined();
      const newAccess = getCookie(setCookies, 'access_token');
      const newRefresh = getCookie(setCookies, 'refresh_token');
      expect(newAccess).toBeDefined();
      expect(newRefresh).toBeDefined();
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 401 when not authenticated', () => {
      return request(server).post('/auth/logout').expect(401);
    });

    it('should logout successfully and clear cookies when authenticated', async () => {
      const res = await request(server)
        .post('/auth/logout')
        .set('Cookie', [accessCookie!, refreshCookie!])
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Logout successful');

      const setCookies = res.headers['set-cookie'] as string | string[] | undefined;
      expect(setCookies).toBeDefined();
      const cookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies!];
      // Expect cookies to be cleared
      expect(cookiesArray.some((c) => c.startsWith('access_token=;'))).toBe(true);
      expect(cookiesArray.some((c) => c.startsWith('refresh_token=;'))).toBe(true);
    });

    it('should not allow refreshing tokens after logout', async () => {
      await request(server).post('/auth/refresh').set('Cookie', [refreshCookie!]).expect(401);
    });
  });
});
