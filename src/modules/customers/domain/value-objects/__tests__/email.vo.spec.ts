import { Email } from '../email.vo';

describe('Email', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should convert to lowercase', () => {
    const email = new Email('TEST@EXAMPLE.COM');
    expect(email.value).toBe('test@example.com');
  });

  it('should trim whitespace', () => {
    const email = new Email('  test@example.com  ');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw error for empty email', () => {
    expect(() => new Email('')).toThrow('Email cannot be empty');
  });

  it('should throw error for whitespace only email', () => {
    expect(() => new Email('   ')).toThrow('Email cannot be empty');
  });

  it('should throw error for invalid email format', () => {
    expect(() => new Email('invalid-email')).toThrow('Invalid email format');
  });

  it('should throw error for email without @', () => {
    expect(() => new Email('testexample.com')).toThrow('Invalid email format');
  });

  it('should throw error for email without domain', () => {
    expect(() => new Email('test@')).toThrow('Invalid email format');
  });

  it('should throw error for email too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    expect(() => new Email(longEmail)).toThrow('Email cannot exceed 255 characters');
  });

  it('should accept valid email with exactly 255 characters', () => {
    const longEmail = 'a'.repeat(240) + '@example.com';
    const email = new Email(longEmail);
    expect(email.value).toBe(longEmail.toLowerCase());
  });

  it('should return string representation', () => {
    const email = new Email('test@example.com');
    expect(email.toString()).toBe('test@example.com');
  });

  it('should compare equality correctly', () => {
    const email1 = new Email('test@example.com');
    const email2 = new Email('test@example.com');
    const email3 = new Email('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});
