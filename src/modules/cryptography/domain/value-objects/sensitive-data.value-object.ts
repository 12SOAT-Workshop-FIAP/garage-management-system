/**
 * Sensitive Data Value Object
 * Represents sensitive data that needs to be encrypted/decrypted.
 */
export abstract class SensitiveData {
  protected readonly _value: string;
  protected readonly _encryptedValue: string;

  constructor(value: string, encryptedValue?: string) {
    this._value = value;
    this._encryptedValue = encryptedValue || value;
  }

  get encryptedValue(): string {
    return this._encryptedValue;
  }

  get value(): string {
    return this._value;
  }

  abstract validate(): boolean;
  abstract withEncryptedValue(encryptedValue: string): SensitiveData;
  abstract getMaskedValue(): string;
  abstract getFormattedValue(): string;

  equals(other: SensitiveData): boolean {
    // Compare cleaned values to handle formatting differences
    const thisClean = this._value.replace(/\D/g, '');
    const otherClean = other._value.replace(/\D/g, '');
    return thisClean === otherClean;
  }

  toString(): string {
    return this.getMaskedValue();
  }
}
