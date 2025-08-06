import { NotFoundException } from '@nestjs/common';
import { Customer } from '../domain/customer';
import { CustomerRepository } from '../domain/customer.repository';
import { FindByDocumentCustomerService } from '../application/services/find-by-document-customer.service';

describe('FindByDocumentCustomerService', () => {
  let findByDocumentCustomerService: FindByDocumentCustomerService;
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

    findByDocumentCustomerService = new FindByDocumentCustomerService(mockCustomerRepository);
  });

  it('should be defined', () => {
    expect(findByDocumentCustomerService).toBeDefined();
  });

  it('should return the customer if exists', async () => {
    const customerDocument = '98765432100';
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

    mockCustomerRepository.findByDocument.mockResolvedValue(mockCustomer);

    const result = await findByDocumentCustomerService.execute(customerDocument);

    if (!result) {
      fail('Expected customer entity, but got null');
    }

    expect(result).toEqual(mockCustomer);
    expect(result).toBeInstanceOf(Customer);
    expect(result.document).toBe('98765432100');
    expect(mockCustomerRepository.findByDocument).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when customer is not found', async () => {
    const customerDocument = '12354-non-exist';
    mockCustomerRepository.findByDocument.mockResolvedValue(null);

    await expect(findByDocumentCustomerService.execute(customerDocument)).rejects.toThrow(
      new NotFoundException(`Customer with document ${customerDocument} not found`),
    );

    expect(mockCustomerRepository.findByDocument).toHaveBeenCalledTimes(1);
  });
});
