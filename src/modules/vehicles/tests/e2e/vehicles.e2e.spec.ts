import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { CustomersModule } from '@modules/customers/customers.module';
import { VehiclesModule } from '@modules/vehicles/presentation/vehicles.module';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';

describe('Vehicles (e2e)', () => {
  let app: INestApplication;
  let createdVehicleId: number;
  let createdCustomerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_TEST_DB || 'garage',
          entities: [Vehicle, CustomerEntity],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        VehiclesModule,
        CustomersModule,
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

    // Cria um cliente para relacionar ao veículo
    const uniqueDocument = `11144477735`; // CPF válido para teste
    const uniqueEmail = `cliente${Date.now()}@teste.com`;

    const createCustomerResponse = await request(app.getHttpServer()).post('/customers').send({
      name: 'Cliente Padrão',
      personType: 'INDIVIDUAL',
      document: uniqueDocument,
      email: uniqueEmail,
      phone: '5518996787172',
      status: true,
    });

    expect(createCustomerResponse.status).toBe(201);
    createdCustomerId = createCustomerResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /vehicles', () => {
    it('deve criar um veículo com sucesso e retornar customer dentro do response', async () => {
      const randomPlate = `ABC${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
      const dto = {
        brand: 'Fiat',
        model: 'Uno',
        plate: randomPlate,
        year: 2012,
        customerId: createdCustomerId,
      };

      const res = await request(app.getHttpServer()).post('/vehicles').send(dto).expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.brand).toBe(dto.brand);
      expect(res.body.customer).toBeDefined();
      expect(res.body.customer.id).toBe(createdCustomerId);
      createdVehicleId = res.body.id;
    });

    it('deve falhar com dados inválidos', () => {
      const dto = {
        brand: '',
        model: '',
        plate: '',
        year: -1,
        customer: 'invalid' as any,
      };

      return request(app.getHttpServer()).post('/vehicles').send(dto).expect(400);
    });

    it('deve falhar com campos obrigatórios ausentes', () => {
      return request(app.getHttpServer()).post('/vehicles').send({ brand: 'Fiat' }).expect(400);
    });
  });

  describe('GET /vehicles', () => {
    it('deve retornar todos os veículos com relação de customer', async () => {
      const res = await request(app.getHttpServer()).get('/vehicles').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((veh: any) => {
        expect(veh).toHaveProperty('customer');
        expect(veh.customer).toHaveProperty('id');
      });
    });
  });

  describe('GET /vehicles/:id', () => {
    it('deve retornar um veículo específico com customer', async () => {
      const res = await request(app.getHttpServer())
        .get(`/vehicles/${createdVehicleId}`)
        .expect(200);

      expect(res.body.id).toBe(createdVehicleId);
      expect(res.body.customer).toBeDefined();
      expect(res.body.customer.id).toBe(createdCustomerId);
    });

    it('deve retornar 404 para um veículo inexistente', () => {
      return request(app.getHttpServer()).get('/vehicles/999999').expect(404);
    });
  });

  describe('PUT /vehicles/:id', () => {
    it('deve atualizar um veículo e manter relação de customer', async () => {
      const dto = {
        model: 'Uno Mille',
        year: 2015,
      };

      const res = await request(app.getHttpServer())
        .put(`/vehicles/${createdVehicleId}`)
        .send(dto)
        .expect(200);

      expect(res.body.model).toBe(dto.model);
      expect(res.body.customer).toBeDefined();
      expect(res.body.customer.id).toBe(createdCustomerId);
    });

    it('deve retornar 404 ao atualizar veículo inexistente', () => {
      return request(app.getHttpServer())
        .put('/vehicles/999999')
        .send({ model: 'Fake' })
        .expect(404);
    });
  });

  describe('DELETE /vehicles/:id', () => {
    it('deve remover um veículo', () => {
      return request(app.getHttpServer()).delete(`/vehicles/${createdVehicleId}`).expect(204);
    });

    it('deve retornar 404 ao remover veículo inexistente', () => {
      return request(app.getHttpServer()).delete('/vehicles/999999').expect(404);
    });
  });
});