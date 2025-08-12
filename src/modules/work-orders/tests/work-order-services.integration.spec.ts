import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

describe('WorkOrder Integration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('WorkOrder Endpoints', () => {
    it('should validate create work order DTO', async () => {
      const invalidDto = {
        // Missing required fields
      };

      const response = await request(app.getHttpServer())
        .post('/work-orders')
        .send(invalidDto);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});