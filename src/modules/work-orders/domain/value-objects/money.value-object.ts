export class Money {
  private readonly _value: number;

  private constructor(value: number) {
    this.validate(value);
    this._value = value;
  }

  static create(value: number): Money {
    return new Money(value);
  }

  static zero(): Money {
    return new Money(0);
  }

  private validate(value: number): void {
    if (value < 0) {
      throw new Error('Money value cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new Error('Money value must be a finite number');
    }
  }

  get value(): number {
    return this._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  subtract(other: Money): Money {
    return new Money(this._value - other._value);
  }

  multiply(factor: number): Money {
    return new Money(this._value * factor);
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }

  isGreaterThan(other: Money): boolean {
    return this._value > other._value;
  }

  isLessThan(other: Money): boolean {
    return this._value < other._value;
  }

  toString(): string {
    return this._value.toFixed(2);
  }
}
