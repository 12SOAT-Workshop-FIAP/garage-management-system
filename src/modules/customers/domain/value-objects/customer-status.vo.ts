export class CustomerStatus {
  private readonly _value: boolean;

  constructor(value: boolean = true) {
    this._value = value;
  }

  get value(): boolean {
    return this._value;
  }

  get isActive(): boolean {
    return this._value;
  }

  get isInactive(): boolean {
    return !this._value;
  }

  activate(): CustomerStatus {
    return new CustomerStatus(true);
  }

  deactivate(): CustomerStatus {
    return new CustomerStatus(false);
  }

  equals(other: CustomerStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value ? 'active' : 'inactive';
  }
}
