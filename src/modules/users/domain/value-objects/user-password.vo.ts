export class UserPassword {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    if (value.length < 6) {
      throw new Error('Password must have at least 6 characters');
    }

    if (value.length > 255) {
      throw new Error('Password cannot exceed 255 characters');
    }

    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserPassword): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return '[REDACTED]';
  }
}
