import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { AppController } from '../../src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Set environment variables for testing
    process.env.BREVO_API_KEY = 'test-api-key';
    process.env.EMAIL_SENDER = 'test@example.com';
    process.env.SENDER_NAME = 'Test Sender';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [AppController],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  it('/ (GET) Hello World', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
