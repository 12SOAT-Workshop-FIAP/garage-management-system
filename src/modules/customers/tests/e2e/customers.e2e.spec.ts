import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from '../../customers.module';
import { CustomerEntity } from '../../infrastructure/customer.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';
// Note: Vehicle entity handled separately

const INVALID_CPF = '12345678909';
const INVALID_CNPJ = '12345678000100';

describe('Customers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Set environment variables for testing
    process.env.BREVO_API_KEY = 'test-api-key';
    process.env.EMAIL_SENDER = 'test@example.com';
    process.env.SENDER_NAME = 'Test Sender';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || 'host.docker.internal',
          port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_TEST_DB || 'garage',
          entities: [CustomerEntity],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        CustomersModule,
      ],
    })
      .overrideProvider(CryptographyPort)
      .useValue({
        encryptSensitiveData: jest.fn().mockImplementation(async (data: string) => ({
          encryptedValue: data, // Return original value for testing
          getMaskedValue: () => '***.***.***-**',
        })),
        decryptSensitiveData: jest.fn().mockImplementation(async (data: string) => ({
          value: data, // Return original value for testing
        })),
        validateSensitiveData: jest.fn().mockReturnValue(true),
      })
      .compile();

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

  function generateValidCpf(): string {
    // Generate first 9 digits
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

    // Calculate first check digit using the same logic as Document.vo.ts
    const calculateDigit = (base: string, multipliers: number[]): number => {
      const sum = base.split('').reduce((acc, digit, index) => {
        return acc + parseInt(digit) * multipliers[index];
      }, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const baseString = digits.join('');
    const firstDigit = calculateDigit(baseString, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateDigit(baseString + firstDigit, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

    return baseString + firstDigit + secondDigit;
  }

  function generateValidCnpj(): string {
    // Generate first 12 digits
    const digits = Array.from({ length: 12 }, (_, i) =>
      i < 8 ? Math.floor(Math.random() * 10) : i <= 10 ? 0 : 1,
    );

    // Calculate check digits using the same logic as Document.vo.ts
    const calculateDigit = (base: string, multipliers: number[]): number => {
      const sum = base.split('').reduce((acc, digit, index) => {
        return acc + parseInt(digit) * multipliers[index];
      }, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const baseString = digits.join('');
    const firstDigit = calculateDigit(baseString, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateDigit(
      baseString + firstDigit,
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    return baseString + firstDigit + secondDigit;
  }

  describe('POST /customers', () => {
    it('should create a new customer successfully (CPF)', async () => {
      const cpf = generateValidCpf();
      const createDto = {
        name: 'John Doe',
        personType: 'INDIVIDUAL',
        document: cpf,
        phone: '+5511999999999',
        email: 'john@example.com',
        status: true,
      };

      const res = await request(app.getHttpServer()).post('/customers').send(createDto).expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(createDto.name);
      expect(res.body.personType).toBe(createDto.personType);
    });

    it('should fail with invalid document', () => {
      const invalidDto = {
        name: 'Invalid Doc',
        personType: 'INDIVIDUAL',
        document: INVALID_CPF,
        phone: '+5511888888888',
      };

      return request(app.getHttpServer()).post('/customers').send(invalidDto).expect(400);
    });
  });

  describe('GET /customers', () => {
    it('should return all customers', async () => {
      const cpf = generateValidCpf();
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'List Seed',
          personType: 'INDIVIDUAL',
          document: cpf,
          phone: '+5511911111111',
        })
        .expect(201);

      const res = await request(app.getHttpServer()).get('/customers').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /customers/:id', () => {
    it('should return a customer by id', async () => {
      // Arrange: create a customer
      const cpf = generateValidCpf();
      const create = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'Find One',
          personType: 'INDIVIDUAL',
          document: cpf,
          phone: '+5511922222222',
        })
        .expect(201);

      const id = create.body.id;

      const res = await request(app.getHttpServer()).get(`/customers/${id}`).expect(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toBe(id);
    });
  });

  describe('GET /customers/document/:document', () => {
    it('should return customer by document (CPF)', async () => {
      const cpf = generateValidCpf();
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'By Document',
          personType: 'INDIVIDUAL',
          document: cpf,
          phone: '+5511933333333',
        })
        .expect(201);

      const res = await request(app.getHttpServer()).get(`/customers/document/${cpf}`).expect(200);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
    });
  });

  describe('POST /customers (COMPANY)', () => {
    it('should create a new company customer successfully (CNPJ)', async () => {
      const cnpj = generateValidCnpj();
      const createDto = {
        name: 'ACME LTDA',
        personType: 'COMPANY',
        document: cnpj,
        phone: '+5511999888777',
        email: 'contato@acme.com',
        status: true,
      };

      const res = await request(app.getHttpServer()).post('/customers').send(createDto).expect(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(createDto.name);
      expect(res.body.personType).toBe('COMPANY');
    });

    it('should fail with invalid CNPJ', () => {
      const invalidDto = {
        name: 'Bad Company',
        personType: 'COMPANY',
        document: INVALID_CNPJ,
        phone: '+551188887777',
      };
      return request(app.getHttpServer()).post('/customers').send(invalidDto).expect(400);
    });
  });

  describe('GET /customers/document/:document (CNPJ)', () => {
    it('should return company by CNPJ', async () => {
      const cnpj = generateValidCnpj();
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'CNPJ Lookup',
          personType: 'COMPANY',
          document: cnpj,
          phone: '+5511977777777',
        })
        .expect(201);

      const res = await request(app.getHttpServer()).get(`/customers/document/${cnpj}`).expect(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.personType).toBe('COMPANY');
      expect(res.body).toHaveProperty('name');
    });
  });

  describe('PATCH /customers/:id (COMPANY)', () => {
    it('should update a company customer successfully', async () => {
      const cnpj = generateValidCnpj();
      const create = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'To Update Co',
          personType: 'COMPANY',
          document: cnpj,
          phone: '+5511966666666',
        })
        .expect(201);
      const id = create.body.id;

      const updateDto = { name: 'Updated Co', email: 'financeiro@co.com' };
      const res = await request(app.getHttpServer())
        .patch(`/customers/${id}`)
        .send(updateDto)
        .expect(200);
      expect(res.body.name).toBe(updateDto.name);
      expect(res.body.email).toBe(updateDto.email);
      expect(res.body.personType).toBe('COMPANY');
    });
  });

  describe('PATCH /customers/:id', () => {
    it('should update a customer successfully', async () => {
      // Arrange: create a customer
      const cpf = generateValidCpf();
      const create = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'To Update',
          personType: 'INDIVIDUAL',
          document: cpf,
          phone: '+5511944444444',
        })
        .expect(201);
      const id = create.body.id;

      const updateDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const res = await request(app.getHttpServer())
        .patch(`/customers/${id}`)
        .send(updateDto)
        .expect(200);

      expect(res.body.name).toBe(updateDto.name);
      expect(res.body.email).toBe(updateDto.email);
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should delete a customer successfully', async () => {
      const cpf = generateValidCpf();
      const create = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'To Delete',
          personType: 'INDIVIDUAL',
          document: cpf,
          phone: '+5511955555555',
        })
        .expect(201);
      const id = create.body.id;

      await request(app.getHttpServer()).delete(`/customers/${id}`).expect(204);

      const res = await request(app.getHttpServer()).get(`/customers/${id}`).expect(200);

      expect(res.body).toHaveProperty('status');
      expect(res.body.status).toBe(false);
    });
  });
});
