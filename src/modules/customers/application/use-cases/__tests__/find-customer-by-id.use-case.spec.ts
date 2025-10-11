import { FindCustomerByIdUseCase } from '../find-customer-by-id.use-case';
import { FindCustomerByIdQuery } from '../../queries/find-customer-by-id.query';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { Customer } from '../../../domain/entities/customer.entity';
import { CryptographyPort } from '../../../domain/ports/cryptography.port';
import { NotFoundException } from '@nestjs/common';

describe('FindCustomerByIdUseCase', () => {
  let useCase: FindCustomerByIdUseCase;
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

    useCase = new FindCustomerByIdUseCase(mockRepository, mockCryptographyPort);
  });

  it('should find customer by id successfully', async () => {
    const query = new FindCustomerByIdQuery(1);
    const customer = Customer.restore({
      id: 1,
      name: 'João Silva',
      personType: 'INDIVIDUAL',
      document: '11144477735',
      phone: '+5511999999999',
      email: 'joao@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
    });

    mockRepository.findById.mockResolvedValue(customer);
    mockCryptographyPort.decryptSensitiveData.mockResolvedValue({
      value: '11144477735',
    } as any);

    const result = await useCase.execute(query);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockCryptographyPort.decryptSensitiveData).toHaveBeenCalledWith('11144477735', 'cpf');
    expect(result).toBeInstanceOf(Customer);
  });

  it('should throw NotFoundException when customer not found', async () => {
    const query = new FindCustomerByIdQuery(999);
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(query)).rejects.toThrow(NotFoundException);
    expect(mockRepository.findById).toHaveBeenCalledWith(999);
  });

  it('should decrypt vehicle plates when customer has vehicles', async () => {
    const query = new FindCustomerByIdQuery(1);
    const customer = Customer.restore({
      id: 1,
      name: 'João Silva',
      personType: 'INDIVIDUAL',
      document: '11144477735',
      phone: '+5511999999999',
      email: 'joao@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
      vehicleIds: [1],
    });

    mockRepository.findById.mockResolvedValue(customer);
    mockCryptographyPort.decryptSensitiveData.mockResolvedValue({
      value: '11144477735',
    } as any);

    const result = await useCase.execute(query);

    expect(mockCryptographyPort.decryptSensitiveData).toHaveBeenCalledWith('11144477735', 'cpf');
    expect(result.vehicleIds).toEqual([1]);
  });
});
