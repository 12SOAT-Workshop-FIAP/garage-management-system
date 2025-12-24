jest.mock('newrelic', () => ({
  noticeError: jest.fn(),
  recordMetric: jest.fn(),
  recordCustomEvent: jest.fn(),
  addCustomAttribute: jest.fn(),
  addCustomAttributes: jest.fn(),
  setTransactionName: jest.fn(),
  getTransaction: jest.fn(() => ({ ignore: jest.fn() })),
  startSegment: jest.fn((name, record, handler) => handler()),
  startBackgroundTransaction: jest.fn((name, handler) => handler()),
  getTraceMetadata: jest.fn(() => ({ traceId: 'mock-trace', spanId: 'mock-span' })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module, Global } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderORM } from '../infrastructure/entities/work-order.entity';
import { WorkOrderPartORM } from '../infrastructure/entities/work-order-part.entity';
import { WorkOrderServiceORM } from '../infrastructure/entities/work-order-service.entity';
import { PartOrmEntity } from '@modules/parts/infrastructure/entities/part-orm.entity';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { WorkOrdersModule } from '../presentation/work-orders.module';
import { VehicleOrmEntity } from '@modules/vehicles/infrastructure/entities/vehicle-orm.entity';
import { NewRelicService } from '@shared/infrastructure/new-relic.service';
import { WinstonLoggerService } from '@shared/infrastructure/winston-logger.service';

describe('WorkOrder Integration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.BREVO_API_KEY = 'test-api-key';
    process.env.EMAIL_SENDER = 'test@example.com';
    process.env.SENDER_NAME = 'Test Sender';

    @Global()
    @Module({
      providers: [
        {
          provide: NewRelicService,
          useValue: {
            recordEvent: jest.fn(),
            recordMetric: jest.fn(),
            incrementMetric: jest.fn(),
            addCustomAttributes: jest.fn(),
            noticeError: jest.fn(),
            recordError: jest.fn(),
          },
        },
        {
          provide: WinstonLoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            setContext: jest.fn(),
            logBusinessEvent: jest.fn(),
          },
        },
      ],
      exports: [NewRelicService, WinstonLoggerService],
    })
    class MockSharedModule {}

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MockSharedModule,
        WorkOrdersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_TEST_HOST || 'host.docker.internal',
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
    if (app) {
      await app.close();
    }
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
