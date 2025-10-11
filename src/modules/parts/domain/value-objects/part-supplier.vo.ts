export class PartSupplier {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Part supplier cannot be empty');
    }
    if (value.trim().length < 2) {
      throw new Error('Part supplier must have at least 2 characters');
    }
    if (value.trim().length > 100) {
      throw new Error('Part supplier cannot exceed 100 characters');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: PartSupplier): boolean {
    return this._value === other._value;
  }
}