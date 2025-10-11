import { CreateCustomerUseCase } from '../create-customer.use-case';
import { CreateCustomerCommand } from '../../commands/create-customer.command';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { Customer } from '../../../domain/entities/customer.entity';
import { CryptographyPort } from '../../../domain/ports/cryptography.port';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let mockRepository: jest.Mocked<CustomerRepository>;
  let mockCryptographyPort: jest.Mocked<CryptographyPort>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
    };

    mockCryptographyPort = {
      encryptSensitiveData: jest.fn(),
      decryptSensitiveData: jest.fn(),
      validateSensitiveData: jest.fn(),
    };

    useCase = new CreateCustomerUseCase(mockRepository, mockCryptographyPort);
  });

  it('should create a customer successfully', async () => {
    const command = new CreateCustomerCommand(
      'João Silva',
      'INDIVIDUAL',
      '11144477735',
      '+5511999999999',
      'joao@example.com',
    );

    const createdCustomer = Customer.create({
      name: 'João Silva',
      personType: 'INDIVIDUAL',
      document: '11144477735',
      phone: '+5511999999999',
      email: 'joao@example.com',
    });

    mockCryptographyPort.encryptSensitiveData.mockResolvedValue({
      encryptedValue: '11144477735',
      getMaskedValue: () => '***.***.***-**',
    } as any);

    mockRepository.create.mockResolvedValue(createdCustomer);

    const result = await useCase.execute(command);

    expect(mockCryptographyPort.encryptSensitiveData).toHaveBeenCalledWith('11144477735', 'cpf');
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.any(Object),
        personType: expect.any(Object),
        document: expect.any(Object),
        phone: expect.any(Object),
        email: expect.any(Object),
      }),
    );
    expect(result).toBeInstanceOf(Customer);
  });

  it('should create a company customer successfully', async () => {
    const command = new CreateCustomerCommand(
      'ACME LTDA',
      'COMPANY',
      '11222333000181',
      '+5511999999999',
      'contato@acme.com',
    );

    const createdCustomer = Customer.create({
      name: 'ACME LTDA',
      personType: 'COMPANY',
      document: '11222333000181',
      phone: '+5511999999999',
      email: 'contato@acme.com',
    });

    mockCryptographyPort.encryptSensitiveData.mockResolvedValue({
      encryptedValue: '11222333000181',
      getMaskedValue: () => '**.***.***/****-**',
    } as any);

    mockRepository.create.mockResolvedValue(createdCustomer);

    const result = await useCase.execute(command);

    expect(mockCryptographyPort.encryptSensitiveData).toHaveBeenCalledWith(
      '11222333000181',
      'cnpj',
    );
    expect(result).toBeInstanceOf(Customer);
  });

  it('should throw error for invalid document', async () => {
    const command = new CreateCustomerCommand(
      'João Silva',
      'INDIVIDUAL',
      'invalid_document',
      '+5511999999999',
    );

    await expect(useCase.execute(command)).rejects.toThrow();
  });
});
