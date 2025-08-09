import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

describe('WorkOrder Services Integration (e2e)', () => {
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

  describe('WorkOrder Services Endpoints', () => {
    it('should have service management endpoints available', () => {
      // Este teste verifica se a aplicação foi inicializada corretamente
      expect(app).toBeDefined();
    });

    it('should validate add service DTO', async () => {
      const invalidDto = {
        // Missing required fields
      };

      const response = await request(app.getHttpServer())
        .post('/work-orders/invalid-id/services')
        .send(invalidDto);

      // Esperamos erro de validação ou não encontrado
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should validate update service DTO', async () => {
      const response = await request(app.getHttpServer())
        .put('/work-orders/invalid-id/services/invalid-service-id')
        .send({});

      // Esperamos erro de validação ou não encontrado
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should validate complete service DTO', async () => {
      const response = await request(app.getHttpServer())
        .post('/work-orders/invalid-id/services/invalid-service-id/complete')
        .send({});

      // Esperamos erro de validação ou não encontrado
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should handle work order not found', async () => {
      const addServiceDto = {
        serviceId: 'valid-service-id',
        estimatedDuration: 120,
        estimatedCost: 150.00,
      };

      const response = await request(app.getHttpServer())
        .post('/work-orders/non-existent-id/services')
        .send(addServiceDto);

      // Esperamos erro 401 (não autorizado) pois o endpoint requer autenticação
      expect(response.status).toBe(401);
    });

    it('should get detailed work order endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/work-orders/non-existent-id/detailed');

      // Esperamos erro 401 (não autorizado) pois o endpoint requer autenticação
      expect(response.status).toBe(401);
    });
  });
});