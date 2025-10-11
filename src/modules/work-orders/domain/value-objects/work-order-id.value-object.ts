import { randomUUID } from 'crypto';

export class WorkOrderId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value?: string): WorkOrderId {
    const id = value || randomUUID();
    return new WorkOrderId(id);
  }

  get value(): string {
    return this._value;
  }

  equals(other: WorkOrderId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
