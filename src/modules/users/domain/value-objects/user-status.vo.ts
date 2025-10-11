export class UserStatus {
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

  activate(): UserStatus {
    return new UserStatus(true);
  }

  deactivate(): UserStatus {
    return new UserStatus(false);
  }

  equals(other: UserStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value ? 'active' : 'inactive';
  }
}
