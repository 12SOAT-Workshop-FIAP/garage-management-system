export class CustomerId {
  private readonly _value: number;

  constructor(value: number) {
    if (!value || value <= 0) {
      throw new Error('Customer ID must be a positive number');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: CustomerId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}
