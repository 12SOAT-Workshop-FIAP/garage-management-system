import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { CustomersModule } from '@modules/customers/presentation/customers.module';
import { VehiclesModule } from '@modules/vehicles/presentation/vehicles.module';

describe('Vehicles (e2e)', () => {
  let app: INestApplication;
  let createdVehicleId: number;
  let createdCustomerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'teste_db',
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

    // Cria um cliente com todos os campos obrigatórios
    const uniqueDocument = `12345678901${Date.now()}`;
    const uniqueEmail = `cliente${Date.now()}@teste.com`;

    const createCustomerResponse = await request(app.getHttpServer())
      .post('/customers')
      .send({
        name: 'Cliente Padrão',
        personType: 'INDIVIDUAL',
        document: '12345678901',
        email: uniqueEmail,
        phone: '123456789',
        status: true,
      });

    // Se o teste para criar cliente falhar, a execução vai parar aqui, o que é útil para depurar
    expect(createCustomerResponse.status).toBe(201);
    createdCustomerId = createCustomerResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /vehicles', () => {
    it('deve criar um veículo com sucesso', async () => {
      const dto = {
        brand: 'Fiat',
        model: 'Uno',
        plate: `ABC-1234${Date.now()}`,
        year: 2012,
        customer_id: createdCustomerId,
      };

      await request(app.getHttpServer())
        .post('/vehicles')
        .send(dto)
        .expect(201)
        .catch((err) => {
          console.error('Erro no POST /vehicles. Resposta da API:', err.response.body);
          throw err;
        })
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.brand).toBe(dto.brand);
          createdVehicleId = res.body.id;
        });
    });

    it('deve falhar com dados inválidos', () => {
      const dto = {
        brand: '',
        model: '',
        plate: '',
        year: -1,
        customer_id: 'invalid' as any,
      };

      return request(app.getHttpServer()).post('/vehicles').send(dto).expect(400);
    });

    it('deve falhar com campos obrigatórios ausentes', () => {
      return request(app.getHttpServer())
        .post('/vehicles')
        .send({ brand: 'Fiat' })
        .expect(400);
    });
  });

  describe('GET /vehicles', () => {
    it('deve retornar todos os veículos', async () => {
      return request(app.getHttpServer())
        .get('/vehicles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /vehicles/:id', () => {
    it('deve retornar um veículo específico', async () => {
      return request(app.getHttpServer())
        .get(`/vehicles/${createdVehicleId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdVehicleId);
        });
    });

    it('deve retornar 404 para um veículo inexistente', () => {
      return request(app.getHttpServer()).get('/vehicles/999999').expect(404);
    });
  });

  describe('PUT /vehicles/:id', () => {
    it('deve atualizar um veículo', () => {
      const dto = {
        model: 'Uno Mille',
        year: 2015,
      };

      return request(app.getHttpServer())
        .put(`/vehicles/${createdVehicleId}`)
        .send(dto)
        .expect(200)
        .expect((res) => {
          expect(res.body.model).toBe(dto.model);
        });
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
      return request(app.getHttpServer())
        .delete(`/vehicles/${createdVehicleId}`)
        .expect(204);
    });

    it('deve retornar 404 ao remover veículo inexistente', () => {
      return request(app.getHttpServer()).delete('/vehicles/999999').expect(404);
    });
  });
});