import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyService } from '../application/services/cryptography.service';
import { ICryptographyRepository } from '../domain/cryptography.repository';
import { CPF } from '../domain/value-objects/cpf.value-object';
import { CNPJ } from '../domain/value-objects/cnpj.value-object';
import { LicensePlate } from '../domain/value-objects/license-plate.value-object';

describe('CryptographyService', () => {
  let service: CryptographyService;
  let mockRepository: ICryptographyRepository;

  const mockRepositoryImpl = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    generateHash: jest.fn(),
    verifyHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyService,
        {
          provide: ICryptographyRepository,
          useValue: mockRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<CryptographyService>(CryptographyService);
    mockRepository = module.get(ICryptographyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encryptSensitiveData', () => {
    it('should encrypt CPF data', async () => {
      const cpfData = '11144477735'; // Valid CPF
      const encryptedData = 'encrypted_cpf_data';

      mockRepositoryImpl.encrypt.mockResolvedValue(encryptedData);

      const result = await service.encryptSensitiveData(cpfData, 'cpf');

      expect(result).toBeInstanceOf(CPF);
      expect(result.encryptedValue).toBe(encryptedData);
      expect(mockRepositoryImpl.encrypt).toHaveBeenCalledWith(cpfData);
    });

    it('should encrypt CNPJ data', async () => {
      const cnpjData = '11222333000181'; // Valid CNPJ
      const encryptedData = 'encrypted_cnpj_data';

      mockRepositoryImpl.encrypt.mockResolvedValue(encryptedData);

      const result = await service.encryptSensitiveData(cnpjData, 'cnpj');

      expect(result).toBeInstanceOf(CNPJ);
      expect(result.encryptedValue).toBe(encryptedData);
      expect(mockRepositoryImpl.encrypt).toHaveBeenCalledWith(cnpjData);
    });

    it('should encrypt license plate data', async () => {
      const licensePlateData = 'ABC1234'; // Valid license plate format
      const encryptedData = 'encrypted_license_plate_data';

      mockRepositoryImpl.encrypt.mockResolvedValue(encryptedData);

      const result = await service.encryptSensitiveData(licensePlateData, 'license-plate');

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.encryptedValue).toBe(encryptedData);
      expect(mockRepositoryImpl.encrypt).toHaveBeenCalledWith(licensePlateData);
    });
  });

  describe('decryptSensitiveData', () => {
    it('should decrypt CPF data and return CPF value object', async () => {
      const encryptedData = 'encrypted_cpf_data';
      const decryptedCpf = '12345678901';

      mockRepositoryImpl.decrypt.mockResolvedValue(decryptedCpf);

      const result = await service.decryptSensitiveData(encryptedData, 'cpf');

      expect(result).toBeInstanceOf(CPF);
      expect(result.value).toBe(decryptedCpf);
      expect(mockRepositoryImpl.decrypt).toHaveBeenCalledWith(encryptedData);
    });

    it('should decrypt CNPJ data and return CNPJ value object', async () => {
      const encryptedData = 'encrypted_cnpj_data';
      const decryptedCnpj = '12345678000195';

      mockRepositoryImpl.decrypt.mockResolvedValue(decryptedCnpj);

      const result = await service.decryptSensitiveData(encryptedData, 'cnpj');

      expect(result).toBeInstanceOf(CNPJ);
      expect(result.value).toBe(decryptedCnpj);
      expect(mockRepositoryImpl.decrypt).toHaveBeenCalledWith(encryptedData);
    });

    it('should decrypt license plate data and return LicensePlate value object', async () => {
      const encryptedData = 'encrypted_license_plate_data';
      const decryptedLicensePlate = 'ABC1234';

      mockRepositoryImpl.decrypt.mockResolvedValue(decryptedLicensePlate);

      const result = await service.decryptSensitiveData(encryptedData, 'license-plate');

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.value).toBe(decryptedLicensePlate);
      expect(mockRepositoryImpl.decrypt).toHaveBeenCalledWith(encryptedData);
    });
  });
});