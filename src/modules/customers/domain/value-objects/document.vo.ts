export class Document {
  private readonly _value: string;
  private readonly _type: 'cpf' | 'cnpj';

  constructor(value: string) {
    const cleanValue = value.replace(/[^\d]/g, '');

    if (!cleanValue) {
      throw new Error('Document cannot be empty');
    }

    if (cleanValue.length === 11) {
      this._type = 'cpf';
      if (!this.isValidCPF(cleanValue)) {
        throw new Error('Invalid CPF format');
      }
    } else if (cleanValue.length === 14) {
      this._type = 'cnpj';
      if (!this.isValidCNPJ(cleanValue)) {
        throw new Error('Invalid CNPJ format');
      }
    } else {
      throw new Error('Document must have 11 digits (CPF) or 14 digits (CNPJ)');
    }

    this._value = cleanValue;
  }

  get value(): string {
    return this._value;
  }

  get type(): 'cpf' | 'cnpj' {
    return this._type;
  }

  get isCPF(): boolean {
    return this._type === 'cpf';
  }

  get isCNPJ(): boolean {
    return this._type === 'cnpj';
  }

  get formatted(): string {
    if (this._type === 'cpf') {
      return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return this._value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  }

  get masked(): string {
    if (this._type === 'cpf') {
      return `***.***.***-**`;
    } else {
      return `**.***.***/****-**`;
    }
  }

  equals(other: Document): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private isValidCPF(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const calculateDigit = (base: string, multipliers: number[]): number => {
      const sum = base.split('').reduce((acc, digit, index) => {
        return acc + parseInt(digit) * multipliers[index];
      }, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateDigit(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateDigit(cpf.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

    return parseInt(cpf[9]) === firstDigit && parseInt(cpf[10]) === secondDigit;
  }

  private isValidCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    const calculateDigit = (base: string, multipliers: number[]): number => {
      const sum = base.split('').reduce((acc, digit, index) => {
        return acc + parseInt(digit) * multipliers[index];
      }, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return parseInt(cnpj[12]) === firstDigit && parseInt(cnpj[13]) === secondDigit;
  }
}
