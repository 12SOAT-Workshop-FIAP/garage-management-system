export class CustomerName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Customer name cannot be empty');
    }

    if (value.trim().length < 2) {
      throw new Error('Customer name must have at least 2 characters');
    }

    if (value.trim().length > 100) {
      throw new Error('Customer name cannot exceed 100 characters');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: CustomerName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
