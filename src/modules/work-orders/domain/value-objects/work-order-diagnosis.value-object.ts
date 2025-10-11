export class WorkOrderDiagnosis {
  private readonly _value: string;

  private constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  static create(value: string): WorkOrderDiagnosis {
    return new WorkOrderDiagnosis(value);
  }

  static createOptional(value?: string): WorkOrderDiagnosis | undefined {
    return value ? new WorkOrderDiagnosis(value) : undefined;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Work order diagnosis cannot be empty');
    }
    if (value.length > 2000) {
      throw new Error('Work order diagnosis cannot exceed 2000 characters');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: WorkOrderDiagnosis): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
