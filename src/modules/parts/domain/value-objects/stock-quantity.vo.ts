export class StockQuantity {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Stock quantity must be an integer');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: StockQuantity): boolean {
    return this._value === other._value;
  }

  add(quantity: number): StockQuantity {
    if (quantity < 0) {
      throw new Error('Cannot add negative quantity');
    }
    return new StockQuantity(this._value + quantity);
  }

  subtract(quantity: number): StockQuantity {
    if (quantity < 0) {
      throw new Error('Cannot subtract negative quantity');
    }
    if (this._value < quantity) {
      throw new Error('Cannot subtract more than current stock');
    }
    return new StockQuantity(this._value - quantity);
  }

  isLowStock(minLevel: number): boolean {
    return this._value <= minLevel;
  }
}