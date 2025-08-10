import { Injectable, Inject } from '@nestjs/common';
import { ICryptographyRepository } from '../../domain/cryptography.repository';
import { CPF } from '../../domain/value-objects/cpf.value-object';
import { CNPJ } from '../../domain/value-objects/cnpj.value-object';
import { LicensePlate } from '../../domain/value-objects/license-plate.value-object';

/**
 * Cryptography Utility Service
 * Provides secure handling of sensitive data for developers.
 *
 * This service is designed to be injected into other modules to provide
 * secure encryption, decryption, and validation of sensitive data like
 * CPF, CNPJ, and license plates.
 *
 * Usage example:
 * ```typescript
 * const encryptedCPF = await this.cryptographyService.encryptSensitiveData('12345678901', 'cpf');
 * const decryptedCPF = await this.cryptographyService.decryptSensitiveData(encryptedCPF, 'cpf');
 * ```
 */
@Injectable()
export class CryptographyService {
  constructor(
    @Inject(ICryptographyRepository)
    private readonly cryptographyRepository: ICryptographyRepository,
  ) {}

  /**
   * Encrypts sensitive data with validation
   * @param data - The sensitive data to encrypt
   * @param type - The type of sensitive data ('cpf', 'cnpj', 'license-plate')
   * @returns Promise<SensitiveData> - Encrypted sensitive data value object
   * @throws Error - If data type is invalid or validation fails
   */
  async encryptSensitiveData(
    data: string,
    type: 'cpf' | 'cnpj' | 'license-plate',
  ): Promise<CPF | CNPJ | LicensePlate> {
    switch (type) {
      case 'cpf':
        return this.encryptCPF(data);
      case 'cnpj':
        return this.encryptCNPJ(data);
      case 'license-plate':
        return this.encryptLicensePlate(data);
      default:
        throw new Error(`Unsupported sensitive data type: ${type}`);
    }
  }

  /**
   * Decrypts sensitive data
   * @param encryptedData - The encrypted data to decrypt
   * @param type - The type of sensitive data ('cpf', 'cnpj', 'license-plate')
   * @returns Promise<SensitiveData> - Decrypted sensitive data value object
   * @throws Error - If data type is invalid
   */
  async decryptSensitiveData(
    encryptedData: string,
    type: 'cpf' | 'cnpj' | 'license-plate',
  ): Promise<CPF | CNPJ | LicensePlate> {
    switch (type) {
      case 'cpf':
        return this.decryptCPF(encryptedData);
      case 'cnpj':
        return this.decryptCNPJ(encryptedData);
      case 'license-plate':
        return this.decryptLicensePlate(encryptedData);
      default:
        throw new Error(`Unsupported sensitive data type: ${type}`);
    }
  }

  /**
   * Validates sensitive data without encryption
   * @param data - The data to validate
   * @param type - The type of sensitive data ('cpf', 'cnpj', 'license-plate')
   * @returns boolean - True if data is valid
   */
  validateSensitiveData(data: string, type: 'cpf' | 'cnpj' | 'license-plate'): boolean {
    switch (type) {
      case 'cpf':
        return this.validateCPF(data);
      case 'cnpj':
        return this.validateCNPJ(data);
      case 'license-plate':
        return this.validateLicensePlate(data);
      default:
        throw new Error(`Unsupported sensitive data type: ${type}`);
    }
  }

  /**
   * Encrypts and validates CPF
   * @param cpfValue - The CPF value to encrypt
   * @returns Promise<CPF> - Encrypted CPF value object
   * @throws Error - If CPF format is invalid
   */
  async encryptCPF(cpfValue: string): Promise<CPF> {
    const cpf = new CPF(cpfValue);

    if (!cpf.validate()) {
      throw new Error('Invalid CPF format');
    }

    const encryptedValue = await this.cryptographyRepository.encrypt(cpfValue);
    return cpf.withEncryptedValue(encryptedValue);
  }

  /**
   * Decrypts CPF
   * @param encryptedCPF - The encrypted CPF value
   * @returns Promise<CPF> - Decrypted CPF value object
   */
  async decryptCPF(encryptedCPF: string): Promise<CPF> {
    const decryptedValue = await this.cryptographyRepository.decrypt(encryptedCPF);
    return new CPF(decryptedValue, encryptedCPF);
  }

  /**
   * Encrypts and validates CNPJ
   * @param cnpjValue - The CNPJ value to encrypt
   * @returns Promise<CNPJ> - Encrypted CNPJ value object
   * @throws Error - If CNPJ format is invalid
   */
  async encryptCNPJ(cnpjValue: string): Promise<CNPJ> {
    const cnpj = new CNPJ(cnpjValue);

    if (!cnpj.validate()) {
      throw new Error('Invalid CNPJ format');
    }

    const encryptedValue = await this.cryptographyRepository.encrypt(cnpjValue);
    return cnpj.withEncryptedValue(encryptedValue);
  }

  /**
   * Decrypts CNPJ
   * @param encryptedCNPJ - The encrypted CNPJ value
   * @returns Promise<CNPJ> - Decrypted CNPJ value object
   */
  async decryptCNPJ(encryptedCNPJ: string): Promise<CNPJ> {
    const decryptedValue = await this.cryptographyRepository.decrypt(encryptedCNPJ);
    return new CNPJ(decryptedValue, encryptedCNPJ);
  }

  /**
   * Encrypts and validates license plate
   * @param plateValue - The license plate value to encrypt
   * @returns Promise<LicensePlate> - Encrypted license plate value object
   * @throws Error - If license plate format is invalid
   */
  async encryptLicensePlate(plateValue: string): Promise<LicensePlate> {
    const plate = new LicensePlate(plateValue);

    if (!plate.validate()) {
      throw new Error('Invalid license plate format');
    }

    const encryptedValue = await this.cryptographyRepository.encrypt(plateValue);
    return plate.withEncryptedValue(encryptedValue);
  }

  /**
   * Decrypts license plate
   * @param encryptedPlate - The encrypted license plate value
   * @returns Promise<LicensePlate> - Decrypted license plate value object
   */
  async decryptLicensePlate(encryptedPlate: string): Promise<LicensePlate> {
    const decryptedValue = await this.cryptographyRepository.decrypt(encryptedPlate);
    return new LicensePlate(decryptedValue, encryptedPlate);
  }

  /**
   * Creates a hash of sensitive data
   * @param data - The data to hash
   * @returns Promise<string> - The hashed data
   */
  async hashData(data: string): Promise<string> {
    return this.cryptographyRepository.hash(data);
  }

  /**
   * Verifies if data matches a hash
   * @param data - The data to verify
   * @param hash - The hash to compare against
   * @returns Promise<boolean> - True if data matches hash
   */
  async verifyHash(data: string, hash: string): Promise<boolean> {
    return this.cryptographyRepository.verifyHash(data, hash);
  }

  /**
   * Validates CPF without encryption
   * @param cpfValue - The CPF value to validate
   * @returns boolean - True if CPF is valid
   */
  validateCPF(cpfValue: string): boolean {
    const cpf = new CPF(cpfValue);
    return cpf.validate();
  }

  /**
   * Validates CNPJ without encryption
   * @param cnpjValue - The CNPJ value to validate
   * @returns boolean - True if CNPJ is valid
   */
  validateCNPJ(cnpjValue: string): boolean {
    const cnpj = new CNPJ(cnpjValue);
    return cnpj.validate();
  }

  /**
   * Validates license plate without encryption
   * @param plateValue - The license plate value to validate
   * @returns boolean - True if license plate is valid
   */
  validateLicensePlate(plateValue: string): boolean {
    const plate = new LicensePlate(plateValue);
    return plate.validate();
  }
}
