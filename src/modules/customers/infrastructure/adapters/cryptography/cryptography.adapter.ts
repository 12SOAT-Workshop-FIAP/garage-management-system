import { Injectable } from '@nestjs/common';
import { CryptographyPort } from '../../../domain/ports/cryptography.port';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class CryptographyAdapter implements CryptographyPort {
  constructor(private readonly cryptographyService: CryptographyService) {}

  async encryptSensitiveData(
    data: string,
    type: 'cpf' | 'cnpj' | 'license-plate',
  ): Promise<{
    encryptedValue: string;
    getMaskedValue(): string;
  }> {
    return await this.cryptographyService.encryptSensitiveData(data, type);
  }

  async decryptSensitiveData(
    encryptedData: string,
    type: 'cpf' | 'cnpj' | 'license-plate',
  ): Promise<{
    value: string;
  }> {
    return await this.cryptographyService.decryptSensitiveData(encryptedData, type);
  }

  validateSensitiveData(data: string, type: 'cpf' | 'cnpj' | 'license-plate'): boolean {
    return this.cryptographyService.validateSensitiveData(data, type);
  }
}
