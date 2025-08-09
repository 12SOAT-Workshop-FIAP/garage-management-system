import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FindByDocumentCustomerService } from '../application/services/find-by-document-customer.service';
import { CustomerRepository } from '../domain/customer.repository';
import { Customer } from '../domain/customer';

describe('FindByDocumentCustomerService', () => {
  let service: FindByDocumentCustomerService;
  let customerRepository: jest.Mocked<CustomerRepository>;

  const mockCustomer = new Customer({
    id: 1,
    name: 'João Silva',
    personType: 'INDIVIDUAL',
    document: '11144477735',
    phone: '+5511999999999',
    email: 'joao@email.com',
    status: true
  });

  beforeEach(async () => {
    const mockRepository = {
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByDocumentCustomerService,
        {
          provide: CustomerRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FindByDocumentCustomerService>(FindByDocumentCustomerService);
    customerRepository = module.get(CustomerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return customer when found with valid CPF', async () => {
      customerRepository.findByDocument.mockResolvedValue(mockCustomer);

      const result = await service.execute('111.444.777-35');

      expect(customerRepository.findByDocument).toHaveBeenCalledWith('11144477735');
      expect(result).toBe(mockCustomer);
    });

    it('should return customer when found with valid CNPJ', async () => {
      const companyCustomer = new Customer({
        id: 2,
        name: 'Empresa LTDA',
        personType: 'COMPANY',
        document: '11222333000181',
        phone: '+5511888888888',
        status: true
      });

      customerRepository.findByDocument.mockResolvedValue(companyCustomer);

      const result = await service.execute('11.222.333/0001-81');

      expect(customerRepository.findByDocument).toHaveBeenCalledWith('11222333000181');
      expect(result).toBe(companyCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      customerRepository.findByDocument.mockResolvedValue(null);

      await expect(service.execute('111.444.777-35')).rejects.toThrow(NotFoundException);
      expect(customerRepository.findByDocument).toHaveBeenCalledWith('11144477735');
    });

    it('should throw BadRequestException for invalid CPF', async () => {
      await expect(service.execute('111.444.777-36')).rejects.toThrow(BadRequestException);
      expect(customerRepository.findByDocument).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid CNPJ', async () => {
      await expect(service.execute('11.222.333/0001-82')).rejects.toThrow(BadRequestException);
      expect(customerRepository.findByDocument).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for document with wrong length', async () => {
      await expect(service.execute('123456789')).rejects.toThrow(BadRequestException);
      expect(customerRepository.findByDocument).not.toHaveBeenCalled();
    });

    it('should handle documents with various formatting', async () => {
      customerRepository.findByDocument.mockResolvedValue(mockCustomer);

      await service.execute('11144477735'); // No formatting
      await service.execute('111.444.777-35'); // Standard formatting
      await service.execute('111 444 777 35'); // Space formatting

      expect(customerRepository.findByDocument).toHaveBeenCalledTimes(3);
      expect(customerRepository.findByDocument).toHaveBeenNthCalledWith(1, '11144477735');
      expect(customerRepository.findByDocument).toHaveBeenNthCalledWith(2, '11144477735');
      expect(customerRepository.findByDocument).toHaveBeenNthCalledWith(3, '11144477735');
    });
  });
});
