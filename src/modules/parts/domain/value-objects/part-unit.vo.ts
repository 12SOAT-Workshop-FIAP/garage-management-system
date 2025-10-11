export class PartUnit {
  private readonly _value: string;
  private static readonly VALID_UNITS = ['PC', 'KG', 'L', 'M', 'CM', 'MM', 'G', 'ML', 'SET', 'BOX', 'PAIR'];

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Part unit cannot be empty');
    }
    const upperValue = value.trim().toUpperCase();
    if (!PartUnit.VALID_UNITS.includes(upperValue)) {
      throw new Error(`Invalid unit. Valid units are: ${PartUnit.VALID_UNITS.join(', ')}`);
    }
    this._value = upperValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: PartUnit): boolean {
    return this._value === other._value;
  }

  static getValidUnits(): string[] {
    return [...PartUnit.VALID_UNITS];
  }
}