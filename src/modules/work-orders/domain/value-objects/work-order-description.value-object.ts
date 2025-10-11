export class WorkOrderDescription {
  private readonly _value: string;

  private constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  static create(value: string): WorkOrderDescription {
    return new WorkOrderDescription(value);
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Work order description cannot be empty');
    }
    if (value.length > 1000) {
      throw new Error('Work order description cannot exceed 1000 characters');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: WorkOrderDescription): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
