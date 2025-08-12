import { NotFoundException } from '@nestjs/common';
import { FindOneCustomerService } from '../application/services/find-one-customer.sevice';
import { Customer } from '../domain/customer';
import { CustomerRepository } from '../domain/customer.repository';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

describe('FindOneCustomerService', () => {
  let findOneCustomerService: FindOneCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;
  let mockCryptographyService: Partial<CryptographyService>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
    };

    mockCryptographyService = {
      decryptSensitiveData: jest.fn().mockResolvedValue({ value: '12345678901' }),
    };

    findOneCustomerService = new FindOneCustomerService(
      mockCustomerRepository,
      mockCryptographyService as CryptographyService,
    );
  });

  it('should return a customer when found', async () => {
    const customerId = 1;
    const customer = new Customer({
      id: customerId,
      name: 'John Doe',
      personType: 'INDIVIDUAL',
      document: '12345678901',
      email: 'john@example.com',
      phone: '+5511999999999',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
    });

    mockCustomerRepository.findById.mockResolvedValue(customer);

    const result = await findOneCustomerService.execute(customerId);

    expect(result).toEqual(customer);
    expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customerId);
  });

  it('should throw NotFoundException when customer not found', async () => {
    const customerId = 999;
    mockCustomerRepository.findById.mockResolvedValue(null);

    await expect(findOneCustomerService.execute(customerId)).rejects.toThrow(
      new NotFoundException(`Customer with ID ${customerId} not found`),
    );

    expect(mockCustomerRepository.findById).toHaveBeenCalledWith(customerId);
  });
});