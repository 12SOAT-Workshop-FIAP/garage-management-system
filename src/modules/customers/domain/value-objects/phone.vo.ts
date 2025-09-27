export class Phone {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone cannot be empty');
    }

    const cleanValue = value.replace(/[^\d+]/g, '');

    const phoneRegex = /^\+55\d{10,11}$/;
    if (!phoneRegex.test(cleanValue)) {
      throw new Error('Invalid phone format. Must be in E.164 format for Brazil (+55XXXXXXXXXXX)');
    }

    this._value = cleanValue;
  }

  get value(): string {
    return this._value;
  }

  get formatted(): string {
    const digits = this._value.slice(3);
    if (digits.length === 11) {
      return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else {
      return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
  }

  equals(other: Phone): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
