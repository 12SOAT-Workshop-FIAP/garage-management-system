import { PersonType, PersonTypeEnum } from '../person-type.vo';

describe('PersonType', () => {
  it('should create INDIVIDUAL person type', () => {
    const personType = new PersonType(PersonTypeEnum.INDIVIDUAL);
    expect(personType.value).toBe(PersonTypeEnum.INDIVIDUAL);
    expect(personType.isIndividual).toBe(true);
    expect(personType.isCompany).toBe(false);
  });

  it('should create COMPANY person type', () => {
    const personType = new PersonType(PersonTypeEnum.COMPANY);
    expect(personType.value).toBe(PersonTypeEnum.COMPANY);
    expect(personType.isIndividual).toBe(false);
    expect(personType.isCompany).toBe(true);
  });

  it('should create person type from string', () => {
    const personType = new PersonType('INDIVIDUAL');
    expect(personType.value).toBe(PersonTypeEnum.INDIVIDUAL);
  });

  it('should throw error for invalid person type', () => {
    expect(() => new PersonType('INVALID' as any)).toThrow(
      'Invalid person type: INVALID. Must be INDIVIDUAL or COMPANY',
    );
  });

  it('should return string representation', () => {
    const personType = new PersonType(PersonTypeEnum.INDIVIDUAL);
    expect(personType.toString()).toBe('INDIVIDUAL');
  });

  it('should compare equality correctly', () => {
    const type1 = new PersonType(PersonTypeEnum.INDIVIDUAL);
    const type2 = new PersonType(PersonTypeEnum.INDIVIDUAL);
    const type3 = new PersonType(PersonTypeEnum.COMPANY);

    expect(type1.equals(type2)).toBe(true);
    expect(type1.equals(type3)).toBe(false);
  });
});
