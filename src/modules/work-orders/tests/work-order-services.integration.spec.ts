import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/entities/work-order.entity';
import { WorkOrderPartORM } from '../infrastructure/entities/work-order-part.entity';
import { WorkOrderServiceORM } from '../infrastructure/entities/work-order-service.entity';
import { PartOrmEntity } from '@modules/parts/infrastructure/entities/part-orm.entity';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { WorkOrdersModule } from '../presentation/work-orders.module';
import { VehicleOrmEntity } from '@modules/vehicles/infrastructure/entities/vehicle-orm.entity';

describe('WorkOrder Integration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.BREVO_API_KEY = 'test-api-key';
    process.env.EMAIL_SENDER = 'test@example.com';
    process.env.SENDER_NAME = 'Test Sender';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        WorkOrdersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || 'host.docker.internal',
          port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_TEST_DB || 'garage',
          entities: [
            WorkOrderORM,
            WorkOrderPartORM,
            WorkOrderServiceORM,
            PartOrmEntity,
            CustomerEntity,
            VehicleOrmEntity,
          ],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
      ],
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

      const response = await request(app.getHttpServer()).post('/work-orders').send(invalidDto);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
