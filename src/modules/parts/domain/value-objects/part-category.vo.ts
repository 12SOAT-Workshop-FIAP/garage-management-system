export class PartCategory {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Part category cannot be empty');
    }
    if (value.trim().length < 2) {
      throw new Error('Part category must have at least 2 characters');
    }
    if (value.trim().length > 50) {
      throw new Error('Part category cannot exceed 50 characters');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: PartCategory): boolean {
    return this._value === other._value;
  }
}