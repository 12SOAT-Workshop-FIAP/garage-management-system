export class PartStatus {
  private readonly _value: boolean;

  constructor(value: boolean) {
    this._value = value;
  }

  get value(): boolean {
    return this._value;
  }

  get isActive(): boolean {
    return this._value;
  }

  get isInactive(): boolean {
    return !this._value;
  }

  equals(other: PartStatus): boolean {
    return this._value === other._value;
  }

  activate(): PartStatus {
    return new PartStatus(true);
  }

  deactivate(): PartStatus {
    return new PartStatus(false);
  }
}