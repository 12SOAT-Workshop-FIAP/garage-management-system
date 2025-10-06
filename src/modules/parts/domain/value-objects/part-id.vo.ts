export class PartId {
  private readonly _value: number;

  constructor(value: number) {
    if (!value || value <= 0) {
      throw new Error('Part ID must be a positive number');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: PartId): boolean {
    return this._value === other._value;
  }
}