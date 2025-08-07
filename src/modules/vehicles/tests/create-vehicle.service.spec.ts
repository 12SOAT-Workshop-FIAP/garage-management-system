import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleService } from '../application/services/create-vehicle.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { CreateVehicleDto } from '../application/dtos/create-vehicle.dto';
import { Vehicle } from '../domain/vehicle.entity';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateVehicleService', () => {
  let service: CreateVehicleService;
  let repo: jest.Mocked<VehicleRepository>;
  let customerRepo: jest.Mocked<CustomerRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<VehicleRepository> = {
      create: jest.fn(),
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
      customer: 123,
    };

    const mockCustomer = { id: dto.customer, name: 'John Doe' } as CustomerEntity;

    const expectedVehicle: Vehicle = {
      id: 1,
      brand: dto.brand,
      model: dto.model,
      plate: dto.plate,
      year: dto.year,
      customer: mockCustomer,
      created_at: new Date(),
    };

    customerRepo.findById.mockResolvedValue(mockCustomer);
    repo.create.mockResolvedValue(expectedVehicle);

    const result = await service.execute(dto);

    expect(customerRepo.findById).toHaveBeenCalledWith(dto.customer);
    expect(repo.create).toHaveBeenCalledWith(expect.any(Vehicle));
    expect(result).toEqual(expectedVehicle);
  });

  it('deve lançar NotFoundException se o cliente não for encontrado', async () => {
    const dto: CreateVehicleDto = {
      brand: 'Fiat',
      model: 'Uno',
      plate: 'AAA-1234',
      year: 2010,
      customer: 999, // Non-existent customer
    };

    // Simulate that the customer was not found by returning null
    customerRepo.findById.mockResolvedValue(null);

    // We expect the service to reject with a NotFoundException
    await expect(service.execute(dto)).rejects.toThrow(
      new NotFoundException(`Customer with id ${dto.customer} not found`),
    );
  });
});
