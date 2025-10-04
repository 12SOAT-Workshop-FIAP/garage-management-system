import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateVehicleService } from '../create-vehicle.service';
import { VehicleRepository } from '../../../domain/vehicle.repository';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { CreateVehicleDto } from '../../dtos/create-vehicle.dto';
import { Vehicle } from '../../../domain/vehicle.entity';
import { Customer } from '@modules/customers/domain/customer';
import { it } from '@faker-js/faker/.';
import { describe, beforeEach } from 'node:test';

describe('CreateVehicleService', () => {
  let service: CreateVehicleService;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let customerRepository: jest.Mocked<CustomerRepository>;

  const mockCustomer = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
    document: '12345678901',
    created_at: new Date(),
    updated_at: new Date(),
    vehicles: [],
  } as any;

  const mockVehicle: Vehicle = {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'ABC-1234',
    year: 2020,
    customer: mockCustomer as any,
    created_at: new Date(),
    updated_at: new Date(),
    formatLicensePlate: jest.fn(),
    getLicensePlateType: jest.fn(),
    getMaskedPlate: jest.fn(),
  } as Vehicle;

  beforeEach(async () => {
    const mockVehicleRepository: Partial<VehicleRepository> = {
      save: jest.fn(),
      findByPlate: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCustomerId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockCustomerRepository: Partial<CustomerRepository> = {
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleService,
        {
          provide: VehicleRepository,
          useValue: mockVehicleRepository,
        },
        {
          provide: CustomerRepository,
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CreateVehicleService>(CreateVehicleService);
    vehicleRepository = module.get(VehicleRepository);
    customerRepository = module.get(CustomerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    const createVehicleDto: CreateVehicleDto = {
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'ABC-1234',
      year: 2020,
      customerId: 1,
    };

    it('should create a vehicle successfully', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      vehicleRepository.findByPlate.mockResolvedValue(null);
      vehicleRepository.save.mockResolvedValue(mockVehicle);

      const result = await service.execute(createVehicleDto);

      expect(customerRepository.findById).toHaveBeenCalledWith(1);
      expect(vehicleRepository.findByPlate).toHaveBeenCalledWith('ABC-1234');
      expect(vehicleRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockVehicle);
    });

    it('should throw error for invalid license plate format', async () => {
      const invalidDto = { ...createVehicleDto, plate: 'INVALID' };

      await expect(service.execute(invalidDto)).rejects.toThrow('Invalid license plate format');
      expect(customerRepository.findById).not.toHaveBeenCalled();
      expect(vehicleRepository.findByPlate).not.toHaveBeenCalled();
      expect(vehicleRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if license plate already exists', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      vehicleRepository.findByPlate.mockResolvedValue(mockVehicle);

      await expect(service.execute(createVehicleDto)).rejects.toThrow(ConflictException);
      expect(vehicleRepository.findByPlate).toHaveBeenCalledWith('ABC-1234');
      expect(vehicleRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      customerRepository.findById.mockResolvedValue(null);
      vehicleRepository.findByPlate.mockResolvedValue(null);

      await expect(service.execute(createVehicleDto)).rejects.toThrow(NotFoundException);
      expect(customerRepository.findById).toHaveBeenCalledWith(1);
      expect(vehicleRepository.save).not.toHaveBeenCalled();
    });

    it('should validate Mercosul format license plates', async () => {
      const mercosulDto = { ...createVehicleDto, plate: 'ABC1D23' };
      
      customerRepository.findById.mockResolvedValue(mockCustomer);
      vehicleRepository.findByPlate.mockResolvedValue(null);
      vehicleRepository.save.mockResolvedValue(mockVehicle);

      const result = await service.execute(mercosulDto);

      expect(vehicleRepository.findByPlate).toHaveBeenCalledWith('ABC1D23');
      expect(result).toEqual(mockVehicle);
    });

    it('should handle license plates with different formats', async () => {
      const formattedDto = { ...createVehicleDto, plate: 'ABC-1234' };
      const unformattedDto = { ...createVehicleDto, plate: 'ABC1234' };
      
      customerRepository.findById.mockResolvedValue(mockCustomer);
      vehicleRepository.findByPlate.mockResolvedValue(null);
      vehicleRepository.save.mockResolvedValue(mockVehicle);

      await service.execute(formattedDto);
      await service.execute(unformattedDto);

      expect(vehicleRepository.findByPlate).toHaveBeenCalledWith('ABC-1234');
      expect(vehicleRepository.findByPlate).toHaveBeenCalledWith('ABC1234');
    });
  });
});
