import { SensitiveData } from './sensitive-data.value-object';

export class CPF extends SensitiveData {
  private static readonly CPF_PATTERN = /^\d{11}$/;
  private static readonly REPEATED_DIGITS_PATTERN = /^(\d)\1{10}$/;

  validate(): boolean {
    const cleanCPF = this.getCleanValue();

    if (!CPF.CPF_PATTERN.test(cleanCPF)) {
      return false;
    }

    if (CPF.REPEATED_DIGITS_PATTERN.test(cleanCPF)) {
      return false;
    }

    return this.validateCheckDigit(cleanCPF, 9) && this.validateCheckDigit(cleanCPF, 10);
  }

  private validateCheckDigit(cpf: string, position: number): boolean {
    const weights =
      position === 9 ? [10, 9, 8, 7, 6, 5, 4, 3, 2] : [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cpf.charAt(i)) * weights[i];
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    return remainder === parseInt(cpf.charAt(position));
  }

  withEncryptedValue(encryptedValue: string): CPF {
    return new CPF(this._value, encryptedValue);
  }

  getMaskedValue(): string {
    const cleanCPF = this.getCleanValue();
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.***-$4');
  }

  getFormattedValue(): string {
    const cleanCPF = this.getCleanValue();
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private getCleanValue(): string {
    return this._value.replace(/\D/g, '');
  }
}
