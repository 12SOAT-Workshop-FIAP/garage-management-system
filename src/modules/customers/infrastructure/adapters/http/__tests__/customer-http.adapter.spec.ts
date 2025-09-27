import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CustomerHttpAdapter } from '../customer-http.adapter';
import { CreateCustomerUseCase } from '../../../../application/use-cases/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../../../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../../../application/use-cases/delete-customer.use-case';
import { FindCustomerByIdUseCase } from '../../../../application/use-cases/find-customer-by-id.use-case';
import { FindCustomerByDocumentUseCase } from '../../../../application/use-cases/find-customer-by-document.use-case';
import { FindAllCustomersUseCase } from '../../../../application/use-cases/find-all-customers.use-case';
import { Customer } from '../../../../domain/entities/customer.entity';

describe('CustomerHttpAdapter', () => {
  let app: INestApplication;
  let createUseCase: jest.Mocked<CreateCustomerUseCase>;
  let updateUseCase: jest.Mocked<UpdateCustomerUseCase>;
  let deleteUseCase: jest.Mocked<DeleteCustomerUseCase>;
  let findByIdUseCase: jest.Mocked<FindCustomerByIdUseCase>;
  let findByDocumentUseCase: jest.Mocked<FindCustomerByDocumentUseCase>;
  let findAllUseCase: jest.Mocked<FindAllCustomersUseCase>;

  beforeEach(async () => {
    createUseCase = {
      execute: jest.fn(),
    } as any;

    updateUseCase = {
      execute: jest.fn(),
    } as any;

    deleteUseCase = {
      execute: jest.fn(),
    } as any;

    findByIdUseCase = {
      execute: jest.fn(),
    } as any;

    findByDocumentUseCase = {
      execute: jest.fn(),
    } as any;

    findAllUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerHttpAdapter],
      providers: [
        { provide: CreateCustomerUseCase, useValue: createUseCase },
        { provide: UpdateCustomerUseCase, useValue: updateUseCase },
        { provide: DeleteCustomerUseCase, useValue: deleteUseCase },
        { provide: FindCustomerByIdUseCase, useValue: findByIdUseCase },
        { provide: FindCustomerByDocumentUseCase, useValue: findByDocumentUseCase },
        { provide: FindAllCustomersUseCase, useValue: findAllUseCase },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /customers', () => {
    it('should create a customer', async () => {
      const createDto = {
        name: 'João Silva',
        personType: 'INDIVIDUAL' as const,
        document: '11144477735',
        phone: '+5511999999999',
        email: 'joao@example.com',
      };

      const createdCustomer = Customer.create(createDto);
      createUseCase.execute.mockResolvedValue(createdCustomer);

      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createDto.name);
      expect(createUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createDto.name,
          personType: createDto.personType,
          document: createDto.document,
          phone: createDto.phone,
          email: createDto.email,
        }),
      );
    });
  });

  describe('GET /customers', () => {
    it('should return all customers', async () => {
      const customers = [
        Customer.create({
          name: 'João Silva',
          personType: 'INDIVIDUAL' as const,
          document: '11144477735',
          phone: '+5511999999999',
        }),
      ];

      findAllUseCase.execute.mockResolvedValue(customers);

      const response = await request(app.getHttpServer()).get('/customers').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(findAllUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('GET /customers/:id', () => {
    it('should return customer by id', async () => {
      const customer = Customer.restore({
        id: 1,
        name: 'João Silva',
        personType: 'INDIVIDUAL' as const,
        document: '11144477735',
        phone: '+5511999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
      });

      findByIdUseCase.execute.mockResolvedValue(customer);

      const response = await request(app.getHttpServer()).get('/customers/1').expect(200);

      expect(response.body.id).toBe(1);
      expect(findByIdUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should delete customer', async () => {
      deleteUseCase.execute.mockResolvedValue();

      await request(app.getHttpServer()).delete('/customers/1').expect(204);

      expect(deleteUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });
  });
});
