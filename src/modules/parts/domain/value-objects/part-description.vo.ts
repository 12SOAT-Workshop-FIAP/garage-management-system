export class PartDescription {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Part description cannot be empty');
    }
    if (value.trim().length < 5) {
      throw new Error('Part description must have at least 5 characters');
    }
    if (value.trim().length > 500) {
      throw new Error('Part description cannot exceed 500 characters');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: PartDescription): boolean {
    return this._value === other._value;
  }
}