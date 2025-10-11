import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { CreateVehicleDto } from '../application/dtos/create-vehicle.dto';
import { Vehicle } from '../domain/vehicle.entity';
import { CustomerRepository } from '@modules/customers/domain/repositories/customer.repository';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateVehicleService', () => {
  let service: CreateVehicleService;
  let repo: jest.Mocked<VehicleRepository>;
  let customerRepo: jest.Mocked<CustomerRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<VehicleRepository> = {
      create: jest.fn(),
      save: jest.fn(),
      findByPlate: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByCustomerId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    const repoCustomerMock: jest.Mocked<CustomerRepository> = {
      findById: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleService,
        { provide: VehicleRepository, useValue: repoMock },
        { provide: CustomerRepository, useValue: repoCustomerMock },
      ],
    }).compile();

    service = module.get(CreateVehicleService);
    repo = module.get(VehicleRepository);
    customerRepo = module.get(CustomerRepository);
  });

  it('deve criar um veículo corretamente', async () => {
    const dto: CreateVehicleDto = {
      brand: 'Fiat',
      model: 'Uno',
      plate: 'AAA-1234',
      year: 2010,
      customerId: 123,
    };

    const mockCustomer = { id: dto.customerId, name: 'John Doe' } as CustomerEntity;
    const mockVehicle = {
      id: 123,
      brand: dto.brand,
      model: dto.model,
      plate: dto.plate,
      year: dto.year,
      customer: mockCustomer,
      created_at: new Date(),
      updated_at: new Date(),
    } as Vehicle;

    customerRepo.findById.mockResolvedValue(mockCustomer as any);
    repo.findByPlate.mockResolvedValue(null); // No existing vehicle with same plate
    repo.save.mockResolvedValue(mockVehicle);

    const result = await service.execute(dto);

    expect(customerRepo.findById).toHaveBeenCalledWith(dto.customerId);
    expect(repo.save).toHaveBeenCalledWith(expect.any(Vehicle));
    expect(result).toEqual(mockVehicle);
  });

  it('deve lançar erro quando customer não existe', async () => {
    const dto: CreateVehicleDto = {
      brand: 'Fiat',
      model: 'Uno',
      plate: 'AAA-1234',
      year: 2010,
      customerId: 999,
    };

    customerRepo.findById.mockResolvedValue(null);

    await expect(service.execute(dto)).rejects.toThrow(NotFoundException);
    expect(customerRepo.findById).toHaveBeenCalledWith(dto.customerId);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('deve criar veículo com dados válidos', async () => {
    const dto: CreateVehicleDto = {
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'XYZ-9876',
      year: 2020,
      customerId: 456,
    };

    const mockCustomer = { id: dto.customerId, name: 'Jane Smith' } as CustomerEntity;
    const mockVehicle = {
      id: 456,
      brand: dto.brand,
      model: dto.model,
      plate: dto.plate,
      year: dto.year,
      customer: mockCustomer,
      created_at: new Date(),
      updated_at: new Date(),
    } as Vehicle;

    customerRepo.findById.mockResolvedValue(mockCustomer as any);
    repo.findByPlate.mockResolvedValue(null);
    repo.save.mockResolvedValue(mockVehicle);

    const result = await service.execute(dto);

    expect(result.brand).toBe(dto.brand);
    expect(result.model).toBe(dto.model);
    expect(result.plate).toBe(dto.plate);
    expect(result.year).toBe(dto.year);
    expect(result.customer).toEqual(mockCustomer);
  });
});
