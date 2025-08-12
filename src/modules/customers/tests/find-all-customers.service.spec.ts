import { FindAllCustomerService } from '../application/services/find-all-customer.service';
import { Customer } from '../domain/customer';
import { CustomerRepository } from '../domain/customer.repository';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

describe('FindAllCustomerService', () => {
  let findAllCustomerService: FindAllCustomerService;
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

    findAllCustomerService = new FindAllCustomerService(
      mockCustomerRepository,
      mockCryptographyService as CryptographyService,
    );
  });

  it('should return all customers', async () => {
    const customers = [
      new Customer({
        id: 1,
        name: 'John Doe',
        personType: 'INDIVIDUAL',
        document: '12345678901',
        email: 'john@example.com',
        phone: '+5511999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
      }),
      new Customer({
        id: 2,
        name: 'Jane Smith',
        personType: 'COMPANY',
        document: '12345678000195',
        email: 'jane@example.com',
        phone: '+5511888888888',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
      }),
    ];

    mockCustomerRepository.findAll.mockResolvedValue(customers);

    const result = await findAllCustomerService.execute();

    expect(result).toEqual(customers);
    expect(mockCustomerRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no customers found', async () => {
    mockCustomerRepository.findAll.mockResolvedValue([]);

    const result = await findAllCustomerService.execute();

    expect(result).toEqual([]);
    expect(mockCustomerRepository.findAll).toHaveBeenCalled();
  });
});
