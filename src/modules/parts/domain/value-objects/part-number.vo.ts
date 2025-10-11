export class PartNumber {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Part number cannot be empty');
    }
    if (value.trim().length < 3) {
      throw new Error('Part number must have at least 3 characters');
    }
    if (value.trim().length > 50) {
      throw new Error('Part number cannot exceed 50 characters');
    }
    // Validação de formato alfanumérico com hífens e underscores
    if (!/^[A-Za-z0-9_-]+$/.test(value.trim())) {
      throw new Error('Part number can only contain letters, numbers, hyphens and underscores');
    }
    this._value = value.trim().toUpperCase();
  }

  get value(): string {
    return this._value;
  }

  equals(other: PartNumber): boolean {
    return this._value === other._value;
  }
}