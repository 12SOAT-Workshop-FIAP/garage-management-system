import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FindByDocumentCustomerService } from '../application/services/find-by-document-customer.service';
import { CustomerRepository } from '../domain/customer.repository';
import { Customer } from '../domain/customer';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

describe('FindByDocumentCustomerService', () => {
  let service: FindByDocumentCustomerService;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let cryptographyService: jest.Mocked<CryptographyService>;

  const mockCustomer = new Customer({
    id: 1,
    name: 'João Silva',
    personType: 'INDIVIDUAL',
    document: '11144477735',
    email: 'joao@example.com',
    phone: '+5511999999999',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: true,
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

    const mockCrypto = {
      validateSensitiveData: jest.fn(),
      encryptSensitiveData: jest.fn(),
      decryptSensitiveData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByDocumentCustomerService,
        {
          provide: CustomerRepository,
          useValue: mockRepository,
        },
        {
          provide: CryptographyService,
          useValue: mockCrypto,
        },
      ],
    }).compile();

    service = module.get<FindByDocumentCustomerService>(FindByDocumentCustomerService);
    customerRepository = module.get(CustomerRepository);
    cryptographyService = module.get(CryptographyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return customer when found with valid CPF', async () => {
      cryptographyService.validateSensitiveData.mockReturnValue(true);
      cryptographyService.encryptSensitiveData.mockResolvedValue({
        encryptedValue: 'encrypted_document',
        getMaskedValue: () => '***.***.***-**',
      } as any);
      customerRepository.findByDocument.mockResolvedValue(mockCustomer);

      const result = await service.execute('11144477735');

      expect(cryptographyService.validateSensitiveData).toHaveBeenCalledWith('11144477735', 'cpf');
      expect(cryptographyService.encryptSensitiveData).toHaveBeenCalledWith('11144477735', 'cpf');
      expect(customerRepository.findByDocument).toHaveBeenCalledWith('encrypted_document');
      expect(result).toBe(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      cryptographyService.validateSensitiveData.mockReturnValue(true);
      cryptographyService.encryptSensitiveData.mockResolvedValue({
        encryptedValue: 'encrypted_document',
        getMaskedValue: () => '***.***.***-**',
      } as any);
      customerRepository.findByDocument.mockResolvedValue(null);

      await expect(service.execute('11144477735')).rejects.toThrow(NotFoundException);
      expect(customerRepository.findByDocument).toHaveBeenCalledWith('encrypted_document');
    });

    it('should throw BadRequestException for invalid document', async () => {
      cryptographyService.validateSensitiveData.mockReturnValue(false);

      await expect(service.execute('invalid')).rejects.toThrow(BadRequestException);
      expect(customerRepository.findByDocument).not.toHaveBeenCalled();
    });
  });
});