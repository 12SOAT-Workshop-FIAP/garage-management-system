import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../../src/modules/services/services.module';
import { Service } from '../../src/modules/services/infrastructure/entities/service.entity';

describe('Services (e2e)', () => {
  let app: INestApplication;
  let createdServiceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Service],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        ServicesModule,
      ],
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

  afterAll(async () => {
    await app.close();
  });

  describe('POST /services', () => {
    it('should create a new service successfully', () => {
      const createServiceDto = {
        name: 'Oil Change',
        description: 'Complete oil change service',
        price: 50.99,
        active: true,
        duration: 30,
      };

      return request(app.getHttpServer())
        .post('/services')
        .send(createServiceDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createServiceDto.name);
          expect(res.body.description).toBe(createServiceDto.description);
          expect(res.body.price).toBe(createServiceDto.price);
          expect(res.body.active).toBe(createServiceDto.active);
          expect(res.body.duration).toBe(createServiceDto.duration);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          createdServiceId = res.body.id;
        });
    });

    it('should fail with invalid data', () => {
      const invalidDto = {
        name: '',
        description: '',
        price: -10,
        active: 'invalid',
        duration: -5,
      };

      return request(app.getHttpServer()).post('/services').send(invalidDto).expect(400);
    });

    it('should fail with missing required fields', () => {
      const incompleteDto = {
        name: 'Test Service',
        // missing other required fields
      };

      return request(app.getHttpServer()).post('/services').send(incompleteDto).expect(400);
    });
  });

  describe('GET /services', () => {
    it('should return all services', () => {
      return request(app.getHttpServer())
        .get('/services')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('description');
          expect(res.body[0]).toHaveProperty('price');
          expect(res.body[0]).toHaveProperty('active');
          expect(res.body[0]).toHaveProperty('duration');
          expect(res.body[0]).toHaveProperty('createdAt');
          expect(res.body[0]).toHaveProperty('updatedAt');
        });
    });
  });

  describe('GET /services/:id', () => {
    it('should return a specific service by id', () => {
      return request(app.getHttpServer())
        .get(`/services/${createdServiceId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdServiceId);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('price');
          expect(res.body).toHaveProperty('active');
          expect(res.body).toHaveProperty('duration');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 404 for non-existent service', () => {
      const nonExistentId = 'non-existent-id';
      return request(app.getHttpServer()).get(`/services/${nonExistentId}`).expect(404);
    });
  });

  describe('PUT /services/:id', () => {
    it('should update a service successfully', () => {
      const updateServiceDto = {
        name: 'Updated Oil Change',
        description: 'Updated oil change service',
        price: 75.99,
        active: false,
        duration: 45,
      };

      return request(app.getHttpServer())
        .put(`/services/${createdServiceId}`)
        .send(updateServiceDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdServiceId);
          expect(res.body.name).toBe(updateServiceDto.name);
          expect(res.body.description).toBe(updateServiceDto.description);
          expect(res.body.price).toBe(updateServiceDto.price);
          expect(res.body.active).toBe(updateServiceDto.active);
          expect(res.body.duration).toBe(updateServiceDto.duration);
        });
    });

    it('should return 404 when updating non-existent service', () => {
      const nonExistentId = 'non-existent-id';
      const updateServiceDto = {
        name: 'Updated Service',
        price: 100.0,
      };

      return request(app.getHttpServer())
        .put(`/services/${nonExistentId}`)
        .send(updateServiceDto)
        .expect(404);
    });
  });

  describe('DELETE /services/:id', () => {
    it('should delete a service successfully', () => {
      return request(app.getHttpServer()).delete(`/services/${createdServiceId}`).expect(204);
    });

    it('should return 404 when deleting non-existent service', () => {
      const nonExistentId = 'non-existent-id';
      return request(app.getHttpServer()).delete(`/services/${nonExistentId}`).expect(404);
    });
  });

  describe('Service lifecycle', () => {
    it('should complete full service lifecycle: create, read, update, delete', async () => {
      const createServiceDto = {
        name: 'Lifecycle Test Service',
        description: 'Service for testing full lifecycle',
        price: 25.5,
        active: true,
        duration: 20,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/services')
        .send(createServiceDto)
        .expect(201);

      const serviceId = createResponse.body.id;
      expect(createResponse.body.name).toBe(createServiceDto.name);

      const readResponse = await request(app.getHttpServer())
        .get(`/services/${serviceId}`)
        .expect(200);

      expect(readResponse.body.id).toBe(serviceId);
      expect(readResponse.body.name).toBe(createServiceDto.name);

      const updateServiceDto = {
        name: 'Updated Lifecycle Service',
        price: 35.75,
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/services/${serviceId}`)
        .send(updateServiceDto)
        .expect(200);

      expect(updateResponse.body.name).toBe(updateServiceDto.name);
      expect(updateResponse.body.price).toBe(updateServiceDto.price);

      await request(app.getHttpServer()).delete(`/services/${serviceId}`).expect(204);

      await request(app.getHttpServer()).get(`/services/${serviceId}`).expect(404);
    });
  });
});
