import { NotFoundException } from '@nestjs/common';
import { FindOneCustomerService } from '../application/services/find-one-customer.sevice';
import { Customer } from '../domain/customer';
import { CustomerRepository } from '../domain/customer.repository';

describe('FindOneCustomerService', () => {
  let findOneCustomerService: FindOneCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
    };

    findOneCustomerService = new FindOneCustomerService(mockCustomerRepository);
  });

  it('should be defined', () => {
    expect(findOneCustomerService).toBeDefined();
  });

  it('should return the customer if exists', async () => {
    const customerId = 1;
    const mockCustomer = new Customer({
      id: 2,
      name: 'Maria Oliveira da Silva',
      personType: 'INDIVIDUAL',
      document: '98765432100',
      email: 'maria.oliveira@example.com',
      phone: '+5511976543210',
      createdAt: new Date('2025-07-29T14:34:45.318Z'),
      updatedAt: new Date('2025-07-29T14:36:02.053Z'),
      status: false,
    });

    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

    const result = await findOneCustomerService.execute(customerId);

    if (!result) {
      fail('Expected customer entity, but got null');
    }

    expect(result).toEqual(mockCustomer);
    expect(result).toBeInstanceOf(Customer);
    expect(result.document).toBe('98765432100');
    expect(mockCustomerRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when customer is not found', async () => {
    const customerId = 15;

    mockCustomerRepository.findById.mockResolvedValue(null);

    await expect(findOneCustomerService.execute(customerId)).rejects.toThrow(
      new NotFoundException(`Customer with ID ${customerId} not found`),
    );

    expect(mockCustomerRepository.findById).toHaveBeenCalledTimes(1);
  });
});
