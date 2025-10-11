/// <reference types="jest" />
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { VehiclesController } from '../../presentation/controllers/vehicle.controller';
import { CreateVehicleUseCase } from '../../application/use-cases/create-vehicle.usecase';
import { UpdateVehicleUseCase } from '../../application/use-cases/update-vehicle.usecase';
import { FindVehicleByIdUseCase } from '../../application/use-cases/find-vehicle-by-id.usecase';
import { FindAllVehiclesUseCase } from '../../application/use-cases/find-all-vehicles.usecase';
import { DeleteVehicleUseCase } from '../../application/use-cases/delete-vehicle.usecase';
import { VEHICLE_REPOSITORY, CUSTOMER_REPOSITORY } from '../../domain/ports/tokens';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { Vehicle } from '../../domain/entities/vehicle';
import { Plate } from '../../domain/value-objects/plate';

describe('VehiclesController (e2e, with mocks)', () => {
  let app: INestApplication;
  let vehicleRepo: jest.Mocked<VehicleRepositoryPort>;
  let customerRepo: jest.Mocked<CustomerRepositoryPort>;

  beforeAll(async () => {
    vehicleRepo = {
      findById: jest.fn(),
      findByPlate: jest.fn(),
      findAll: jest.fn(),
      existsByPlate: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    customerRepo = { existsById: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        // ports -> mocks
        { provide: VEHICLE_REPOSITORY, useValue: vehicleRepo },
        { provide: CUSTOMER_REPOSITORY, useValue: customerRepo },
        // use cases (DI injeta os mocks acima)
        CreateVehicleUseCase,
        UpdateVehicleUseCase,
        FindVehicleByIdUseCase,
        FindAllVehiclesUseCase,
        DeleteVehicleUseCase,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(async () => app.close());

  it('POST /vehicles — cria quando customer existe e placa é única', async () => {
    customerRepo.existsById.mockResolvedValue(true);
    vehicleRepo.existsByPlate.mockResolvedValue(false);
    vehicleRepo.save.mockResolvedValue(321); // agora retorna ID

    const res = await request(app.getHttpServer())
      .post('/vehicles')
      .send({ plate: 'ABC1D23', brand: 'Fiat', model: 'Punto', year: 2018, customerId: 1 })
      .expect(201);

    expect(customerRepo.existsById).toHaveBeenCalledWith(1);
    expect(vehicleRepo.save).toHaveBeenCalledTimes(1);
    expect(res.body).toMatchObject({
      id: 321, // espera o ID retornado
      plate: 'ABC1D23',
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });
  });

  it('POST /vehicles — 404 quando customer não existe', async () => {
    customerRepo.existsById.mockResolvedValue(false);

    await request(app.getHttpServer())
      .post('/vehicles')
      .send({ plate: 'ABC1D23', brand: 'Fiat', model: 'Punto', year: 2018, customerId: 999 })
      .expect(404);
  });

  it('GET /vehicles — retorna lista', async () => {
    vehicleRepo.findAll.mockResolvedValue([
      Vehicle.restore(2, { plate: Plate.create('BBB1B22'), brand: 'VW', model: 'Golf', year: 2020, customerId: 5 }),
      Vehicle.restore(1, { plate: Plate.create('AAA1A11'), brand: 'Fiat', model: 'Punto', year: 2018, customerId: 1 }),
    ]);

    const res = await request(app.getHttpServer()).get('/vehicles').expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ id: 2, plate: 'BBB1B22' });
  });

  it('GET /vehicles/:id — 200 quando existe', async () => {
    const v = Vehicle.restore(10, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });
    vehicleRepo.findById.mockResolvedValue(v);

    const res = await request(app.getHttpServer()).get('/vehicles/10').expect(200);
    expect(res.body).toMatchObject({ id: 10, plate: 'ABC1D23' });
  });

  it('GET /vehicles/:id — 404 quando não existe', async () => {
    vehicleRepo.findById.mockResolvedValue(null);
    await request(app.getHttpServer()).get('/vehicles/999').expect(404);
  });

  it('PUT /vehicles/:id — 200 ao atualizar dados básicos (sem trocar owner/plate)', async () => {
    const v = Vehicle.restore(10, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });
    vehicleRepo.findById.mockResolvedValue(v);
    vehicleRepo.update.mockResolvedValue(undefined);

    const res = await request(app.getHttpServer())
      .put('/vehicles/10')
      .send({ model: 'Argo', year: 2019 })
      .expect(200);

    expect(vehicleRepo.findById).toHaveBeenCalledWith(10);
    expect(vehicleRepo.update).toHaveBeenCalledTimes(1);
    expect(res.body).toMatchObject({
      id: 10,
      plate: 'ABC1D23',
      brand: 'Fiat',
      model: 'Argo',
      year: 2019,
      customerId: 1,
    });
  });

  it('PUT /vehicles/:id — 404 quando veículo não existe', async () => {
    vehicleRepo.findById.mockResolvedValue(null);

    await request(app.getHttpServer())
      .put('/vehicles/999')
      .send({ model: 'Qualquer' })
      .expect(404);
  });

  it('PUT /vehicles/:id — 400 quando tentar trocar para placa já existente', async () => {
    const existing = Vehicle.restore(10, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });
    vehicleRepo.findById.mockResolvedValue(existing);

    // placa já usada por OUTRO veículo (id 99)
    const other = Vehicle.restore(99, {
      plate: Plate.create('ZZZ1Z99'),
      brand: 'VW',
      model: 'Golf',
      year: 2020,
      customerId: 3,
    });
    vehicleRepo.findByPlate.mockResolvedValue(other);

    await request(app.getHttpServer())
      .put('/vehicles/10')
      .send({ plate: 'ZZZ1Z99' })
      .expect(400);
  });

  it('PUT /vehicles/:id — 404 quando trocar owner para customer inexistente', async () => {
    const existing = Vehicle.restore(10, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });
    vehicleRepo.findById.mockResolvedValue(existing);
    customerRepo.existsById.mockResolvedValue(false);

    await request(app.getHttpServer())
      .put('/vehicles/10')
      .send({ customerId: 999 })
      .expect(404);
  });

  it('DELETE /vehicles/:id — 204 quando o veículo existe', async () => {
    const v = Vehicle.restore(10, {
      plate: Plate.create('ABC1D23'),
      brand: 'Fiat',
      model: 'Punto',
      year: 2018,
      customerId: 1,
    });
    vehicleRepo.findById.mockResolvedValue(v);
    vehicleRepo.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .delete('/vehicles/10')
      .expect(204);

    expect(vehicleRepo.findById).toHaveBeenCalledWith(10);
    expect(vehicleRepo.delete).toHaveBeenCalledWith(10);
  });

  it('DELETE /vehicles/:id — 404 quando o veículo não existe', async () => {
    vehicleRepo.findById.mockResolvedValue(null);

    await request(app.getHttpServer())
      .delete('/vehicles/999')
      .expect(404);

    expect(vehicleRepo.delete).not.toHaveBeenCalled();
  });
});
