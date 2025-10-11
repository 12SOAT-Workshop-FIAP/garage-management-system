export class Money {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Money value cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new Error('Money value must be a finite number');
    }
    // Arredonda para 2 casas decimais
    this._value = Math.round(value * 100) / 100;
  }

  get value(): number {
    return this._value;
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  subtract(other: Money): Money {
    if (this._value < other._value) {
      throw new Error('Cannot subtract a larger amount from a smaller amount');
    }
    return new Money(this._value - other._value);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Cannot multiply money by a negative factor');
    }
    return new Money(this._value * factor);
  }
}