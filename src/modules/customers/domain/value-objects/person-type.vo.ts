export enum PersonTypeEnum {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export class PersonType {
  private readonly _value: PersonTypeEnum;

  constructor(value: PersonTypeEnum | string) {
    if (!Object.values(PersonTypeEnum).includes(value as PersonTypeEnum)) {
      throw new Error(
        `Invalid person type: ${value}. Must be ${PersonTypeEnum.INDIVIDUAL} or ${PersonTypeEnum.COMPANY}`,
      );
    }
    this._value = value as PersonTypeEnum;
  }

  get value(): PersonTypeEnum {
    return this._value;
  }

  get isIndividual(): boolean {
    return this._value === PersonTypeEnum.INDIVIDUAL;
  }

  get isCompany(): boolean {
    return this._value === PersonTypeEnum.COMPANY;
  }

  equals(other: PersonType): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
