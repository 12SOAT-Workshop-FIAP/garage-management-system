import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyService } from '../application/services/cryptography.service';
import {
  ICryptographyRepository,
  CRYPTOGRAPHY_REPOSITORY,
} from '../domain/cryptography.repository';
import { CPF } from '../domain/value-objects/cpf.value-object';
import { CNPJ } from '../domain/value-objects/cnpj.value-object';
import { LicensePlate } from '../domain/value-objects/license-plate.value-object';

describe('CryptographyService', () => {
  let service: CryptographyService;
  let mockRepository: jest.Mocked<ICryptographyRepository>;

  beforeEach(async () => {
    const mockRepositoryImpl = {
      encrypt: jest.fn(),
      decrypt: jest.fn(),
      hash: jest.fn(),
      verifyHash: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyService,
        {
          provide: CRYPTOGRAPHY_REPOSITORY,
          useValue: mockRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<CryptographyService>(CryptographyService);
    mockRepository = module.get(CRYPTOGRAPHY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encryptSensitiveData', () => {
    it('should encrypt CPF data', async () => {
      const validCPF = '11144477735';
      const encryptedValue = 'encrypted-cpf';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptSensitiveData(validCPF, 'cpf');

      expect(result).toBeInstanceOf(CPF);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validCPF);
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validCPF);
    });

    it('should encrypt CNPJ data', async () => {
      const validCNPJ = '12345678000195';
      const encryptedValue = 'encrypted-cnpj';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptSensitiveData(validCNPJ, 'cnpj');

      expect(result).toBeInstanceOf(CNPJ);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validCNPJ);
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validCNPJ);
    });

    it('should encrypt license plate data', async () => {
      const validPlate = 'ABC1234';
      const encryptedValue = 'encrypted-plate';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptSensitiveData(validPlate, 'license-plate');

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validPlate);
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validPlate);
    });

    it('should throw error for unsupported data type', async () => {
      const data = 'test-data';
      const unsupportedType = 'unsupported' as any;

      await expect(service.encryptSensitiveData(data, unsupportedType)).rejects.toThrow(
        'Unsupported sensitive data type: unsupported',
      );
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });

    it('should throw error for invalid CPF format', async () => {
      const invalidCPF = '12345678900';

      await expect(service.encryptSensitiveData(invalidCPF, 'cpf')).rejects.toThrow(
        'Invalid CPF format',
      );
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });

    it('should throw error for invalid CNPJ format', async () => {
      const invalidCNPJ = '12345678000190';

      await expect(service.encryptSensitiveData(invalidCNPJ, 'cnpj')).rejects.toThrow(
        'Invalid CNPJ format',
      );
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });

    it('should throw error for invalid license plate format', async () => {
      const invalidPlate = 'ABC123';

      await expect(service.encryptSensitiveData(invalidPlate, 'license-plate')).rejects.toThrow(
        'Invalid license plate format',
      );
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });
  });

  describe('decryptSensitiveData', () => {
    it('should decrypt CPF data', async () => {
      const encryptedCPF = 'encrypted-cpf';
      const decryptedValue = '11144477735';

      mockRepository.decrypt.mockResolvedValue(decryptedValue);

      const result = await service.decryptSensitiveData(encryptedCPF, 'cpf');

      expect(result).toBeInstanceOf(CPF);
      expect(result.value).toBe(decryptedValue);
      expect(result.encryptedValue).toBe(encryptedCPF);
      expect(mockRepository.decrypt).toHaveBeenCalledWith(encryptedCPF);
    });

    it('should decrypt CNPJ data', async () => {
      const encryptedCNPJ = 'encrypted-cnpj';
      const decryptedValue = '12345678000195';

      mockRepository.decrypt.mockResolvedValue(decryptedValue);

      const result = await service.decryptSensitiveData(encryptedCNPJ, 'cnpj');

      expect(result).toBeInstanceOf(CNPJ);
      expect(result.value).toBe(decryptedValue);
      expect(result.encryptedValue).toBe(encryptedCNPJ);
      expect(mockRepository.decrypt).toHaveBeenCalledWith(encryptedCNPJ);
    });

    it('should decrypt license plate data', async () => {
      const encryptedPlate = 'encrypted-plate';
      const decryptedValue = 'ABC1234';

      mockRepository.decrypt.mockResolvedValue(decryptedValue);

      const result = await service.decryptSensitiveData(encryptedPlate, 'license-plate');

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.value).toBe(decryptedValue);
      expect(result.encryptedValue).toBe(encryptedPlate);
      expect(mockRepository.decrypt).toHaveBeenCalledWith(encryptedPlate);
    });

    it('should throw error for unsupported data type', async () => {
      const encryptedData = 'encrypted-data';
      const unsupportedType = 'unsupported' as any;

      await expect(service.decryptSensitiveData(encryptedData, unsupportedType)).rejects.toThrow(
        'Unsupported sensitive data type: unsupported',
      );
      expect(mockRepository.decrypt).not.toHaveBeenCalled();
    });
  });

  describe('validateSensitiveData', () => {
    it('should validate CPF correctly', () => {
      const validCPF = '11144477735';
      const invalidCPF = '12345678900';

      expect(service.validateSensitiveData(validCPF, 'cpf')).toBe(true);
      expect(service.validateSensitiveData(invalidCPF, 'cpf')).toBe(false);
    });

    it('should validate CNPJ correctly', () => {
      const validCNPJ = '12345678000195';
      const invalidCNPJ = '12345678000190';

      expect(service.validateSensitiveData(validCNPJ, 'cnpj')).toBe(true);
      expect(service.validateSensitiveData(invalidCNPJ, 'cnpj')).toBe(false);
    });

    it('should validate license plate correctly', () => {
      const validOldPlate = 'ABC1234';
      const validMercosulPlate = 'ABC1D23';
      const invalidPlate = 'ABC123';

      expect(service.validateSensitiveData(validOldPlate, 'license-plate')).toBe(true);
      expect(service.validateSensitiveData(validMercosulPlate, 'license-plate')).toBe(true);
      expect(service.validateSensitiveData(invalidPlate, 'license-plate')).toBe(false);
    });

    it('should throw error for unsupported data type', () => {
      const data = 'test-data';
      const unsupportedType = 'unsupported' as any;

      expect(() => service.validateSensitiveData(data, unsupportedType)).toThrow(
        'Unsupported sensitive data type: unsupported',
      );
    });
  });

  describe('encryptCPF', () => {
    it('should encrypt a valid CPF', async () => {
      const validCPF = '11144477735';
      const encryptedValue = 'encrypted-cpf';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptCPF(validCPF);

      expect(result).toBeInstanceOf(CPF);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validCPF);
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validCPF);
    });

    it('should throw error for invalid CPF', async () => {
      const invalidCPF = '12345678900';

      await expect(service.encryptCPF(invalidCPF)).rejects.toThrow('Invalid CPF format');
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });
  });

  describe('decryptCPF', () => {
    it('should decrypt CPF', async () => {
      const encryptedCPF = 'encrypted-cpf';
      const decryptedValue = '11144477735';

      mockRepository.decrypt.mockResolvedValue(decryptedValue);

      const result = await service.decryptCPF(encryptedCPF);

      expect(result).toBeInstanceOf(CPF);
      expect(result.value).toBe(decryptedValue);
      expect(result.encryptedValue).toBe(encryptedCPF);
      expect(mockRepository.decrypt).toHaveBeenCalledWith(encryptedCPF);
    });
  });

  describe('encryptCNPJ', () => {
    it('should encrypt a valid CNPJ', async () => {
      const validCNPJ = '12345678000195';
      const encryptedValue = 'encrypted-cnpj';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptCNPJ(validCNPJ);

      expect(result).toBeInstanceOf(CNPJ);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validCNPJ);
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validCNPJ);
    });

    it('should throw error for invalid CNPJ', async () => {
      const invalidCNPJ = '12345678000190';

      await expect(service.encryptCNPJ(invalidCNPJ)).rejects.toThrow('Invalid CNPJ format');
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });
  });

  describe('decryptCNPJ', () => {
    it('should decrypt CNPJ', async () => {
      const encryptedCNPJ = 'encrypted-cnpj';
      const decryptedValue = '12345678000195';

      mockRepository.decrypt.mockResolvedValue(decryptedValue);

      const result = await service.decryptCNPJ(encryptedCNPJ);

      expect(result).toBeInstanceOf(CNPJ);
      expect(result.value).toBe(decryptedValue);
      expect(result.encryptedValue).toBe(encryptedCNPJ);
      expect(mockRepository.decrypt).toHaveBeenCalledWith(encryptedCNPJ);
    });
  });

  describe('encryptLicensePlate', () => {
    it('should encrypt a valid old format license plate', async () => {
      const validPlate = 'ABC1234';
      const encryptedValue = 'encrypted-plate';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptLicensePlate(validPlate);

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validPlate);
      expect(result.getPlateType()).toBe('old');
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validPlate);
    });

    it('should encrypt a valid Mercosul format license plate', async () => {
      const validPlate = 'ABC1D23';
      const encryptedValue = 'encrypted-plate';

      mockRepository.encrypt.mockResolvedValue(encryptedValue);

      const result = await service.encryptLicensePlate(validPlate);

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.encryptedValue).toBe(encryptedValue);
      expect(result.value).toBe(validPlate);
      expect(result.getPlateType()).toBe('mercosul');
      expect(mockRepository.encrypt).toHaveBeenCalledWith(validPlate);
    });

    it('should throw error for invalid license plate', async () => {
      const invalidPlate = 'ABC123';

      await expect(service.encryptLicensePlate(invalidPlate)).rejects.toThrow(
        'Invalid license plate format',
      );
      expect(mockRepository.encrypt).not.toHaveBeenCalled();
    });
  });

  describe('decryptLicensePlate', () => {
    it('should decrypt license plate', async () => {
      const encryptedPlate = 'encrypted-plate';
      const decryptedValue = 'ABC1234';

      mockRepository.decrypt.mockResolvedValue(decryptedValue);

      const result = await service.decryptLicensePlate(encryptedPlate);

      expect(result).toBeInstanceOf(LicensePlate);
      expect(result.value).toBe(decryptedValue);
      expect(result.encryptedValue).toBe(encryptedPlate);
      expect(mockRepository.decrypt).toHaveBeenCalledWith(encryptedPlate);
    });
  });

  describe('hashData', () => {
    it('should create hash of data', async () => {
      const data = 'sensitive-data';
      const hash = 'hashed-data';

      mockRepository.hash.mockResolvedValue(hash);

      const result = await service.hashData(data);

      expect(result).toBe(hash);
      expect(mockRepository.hash).toHaveBeenCalledWith(data);
    });
  });

  describe('verifyHash', () => {
    it('should verify hash correctly', async () => {
      const data = 'sensitive-data';
      const hash = 'hashed-data';

      mockRepository.verifyHash.mockResolvedValue(true);

      const result = await service.verifyHash(data, hash);

      expect(result).toBe(true);
      expect(mockRepository.verifyHash).toHaveBeenCalledWith(data, hash);
    });

    it('should return false for non-matching hash', async () => {
      const data = 'sensitive-data';
      const hash = 'hashed-data';

      mockRepository.verifyHash.mockResolvedValue(false);

      const result = await service.verifyHash(data, hash);

      expect(result).toBe(false);
      expect(mockRepository.verifyHash).toHaveBeenCalledWith(data, hash);
    });
  });

  describe('validateCPF', () => {
    it('should validate valid CPF', () => {
      const validCPF = '11144477735';
      expect(service.validateCPF(validCPF)).toBe(true);
    });

    it('should validate invalid CPF', () => {
      const invalidCPF = '12345678900';
      expect(service.validateCPF(invalidCPF)).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('should validate valid CNPJ', () => {
      const validCNPJ = '12345678000195';
      expect(service.validateCNPJ(validCNPJ)).toBe(true);
    });

    it('should validate invalid CNPJ', () => {
      const invalidCNPJ = '12345678000190';
      expect(service.validateCNPJ(invalidCNPJ)).toBe(false);
    });
  });

  describe('validateLicensePlate', () => {
    it('should validate valid old format license plate', () => {
      const validPlate = 'ABC1234';
      expect(service.validateLicensePlate(validPlate)).toBe(true);
    });

    it('should validate valid Mercosul format license plate', () => {
      const validPlate = 'ABC1D23';
      expect(service.validateLicensePlate(validPlate)).toBe(true);
    });

    it('should validate invalid license plate', () => {
      const invalidPlate = 'ABC123';
      expect(service.validateLicensePlate(invalidPlate)).toBe(false);
    });
  });
});
