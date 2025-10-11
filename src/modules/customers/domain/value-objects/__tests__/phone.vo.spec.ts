import { Phone } from '../phone.vo';

describe('Phone', () => {
  it('should create a valid phone number', () => {
    const phone = new Phone('+5511999999999');
    expect(phone.value).toBe('+5511999999999');
  });

  it('should format phone correctly (11 digits)', () => {
    const phone = new Phone('+5511999999999');
    expect(phone.formatted).toBe('+55 (11) 99999-9999');
  });

  it('should format phone correctly (10 digits)', () => {
    const phone = new Phone('+551199999999');
    expect(phone.formatted).toBe('+55 (11) 9999-9999');
  });

  it('should accept phone with formatting', () => {
    const phone = new Phone('+55 (11) 99999-9999');
    expect(phone.value).toBe('+5511999999999');
  });

  it('should throw error for empty phone', () => {
    expect(() => new Phone('')).toThrow('Phone cannot be empty');
  });

  it('should throw error for whitespace only phone', () => {
    expect(() => new Phone('   ')).toThrow('Phone cannot be empty');
  });

  it('should throw error for invalid phone format', () => {
    expect(() => new Phone('11999999999')).toThrow(
      'Invalid phone format. Must be in E.164 format for Brazil (+55XXXXXXXXXXX)',
    );
  });

  it('should throw error for phone without country code', () => {
    expect(() => new Phone('11999999999')).toThrow(
      'Invalid phone format. Must be in E.164 format for Brazil (+55XXXXXXXXXXX)',
    );
  });

  it('should throw error for phone with wrong country code', () => {
    expect(() => new Phone('+1234567890')).toThrow(
      'Invalid phone format. Must be in E.164 format for Brazil (+55XXXXXXXXXXX)',
    );
  });

  it('should throw error for phone too short', () => {
    expect(() => new Phone('+55119999999')).toThrow(
      'Invalid phone format. Must be in E.164 format for Brazil (+55XXXXXXXXXXX)',
    );
  });

  it('should throw error for phone too long', () => {
    expect(() => new Phone('+55119999999999')).toThrow(
      'Invalid phone format. Must be in E.164 format for Brazil (+55XXXXXXXXXXX)',
    );
  });

  it('should return string representation', () => {
    const phone = new Phone('+5511999999999');
    expect(phone.toString()).toBe('+5511999999999');
  });

  it('should compare equality correctly', () => {
    const phone1 = new Phone('+5511999999999');
    const phone2 = new Phone('+5511999999999');
    const phone3 = new Phone('+5511888888888');

    expect(phone1.equals(phone2)).toBe(true);
    expect(phone1.equals(phone3)).toBe(false);
  });
});
