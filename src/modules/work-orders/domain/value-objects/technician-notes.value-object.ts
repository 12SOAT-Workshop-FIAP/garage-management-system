export class TechnicianNotes {
  private readonly _value: string;

  private constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  static create(value: string): TechnicianNotes {
    return new TechnicianNotes(value);
  }

  static createOptional(value?: string): TechnicianNotes | undefined {
    return value ? new TechnicianNotes(value) : undefined;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Technician notes cannot be empty');
    }
    if (value.length > 5000) {
      throw new Error('Technician notes cannot exceed 5000 characters');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: TechnicianNotes): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
