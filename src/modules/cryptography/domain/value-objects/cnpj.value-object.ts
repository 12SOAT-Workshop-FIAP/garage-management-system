import { SensitiveData } from './sensitive-data.value-object';

export class CNPJ extends SensitiveData {
  private static readonly CNPJ_PATTERN = /^\d{14}$/;
  private static readonly REPEATED_DIGITS_PATTERN = /^(\d)\1{13}$/;
  private static readonly WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  private static readonly WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  validate(): boolean {
    const cleanCNPJ = this.getCleanValue();

    if (!CNPJ.CNPJ_PATTERN.test(cleanCNPJ)) {
      return false;
    }

    if (CNPJ.REPEATED_DIGITS_PATTERN.test(cleanCNPJ)) {
      return false;
    }

    return (
      this.validateCheckDigit(cleanCNPJ, 12, CNPJ.WEIGHTS_1) &&
      this.validateCheckDigit(cleanCNPJ, 13, CNPJ.WEIGHTS_2)
    );
  }

  private validateCheckDigit(cnpj: string, position: number, weights: number[]): boolean {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights[i];
    }

    let remainder = sum % 11;
    let digit = remainder < 2 ? 0 : 11 - remainder;

    return digit === parseInt(cnpj.charAt(position));
  }

  withEncryptedValue(encryptedValue: string): CNPJ {
    return new CNPJ(this._value, encryptedValue);
  }

  getMaskedValue(): string {
    const cleanCNPJ = this.getCleanValue();
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '**.***.***/****-$5');
  }

  getFormattedValue(): string {
    const cleanCNPJ = this.getCleanValue();
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  private getCleanValue(): string {
    return this._value.replace(/\D/g, '');
  }
}
