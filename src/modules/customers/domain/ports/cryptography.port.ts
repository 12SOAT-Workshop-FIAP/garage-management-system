export abstract class CryptographyPort {
  abstract encryptSensitiveData(
    data: string,
    type: 'cpf' | 'cnpj' | 'license-plate',
  ): Promise<{
    encryptedValue: string;
    getMaskedValue(): string;
  }>;

  abstract decryptSensitiveData(
    encryptedData: string,
    type: 'cpf' | 'cnpj' | 'license-plate',
  ): Promise<{
    value: string;
  }>;

  abstract validateSensitiveData(data: string, type: 'cpf' | 'cnpj' | 'license-plate'): boolean;
}
