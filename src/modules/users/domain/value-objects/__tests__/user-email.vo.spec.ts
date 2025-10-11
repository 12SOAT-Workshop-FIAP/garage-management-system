import { UserEmail } from '../user-email.vo';

describe('UserEmail', () => {
  it('should create a valid email', () => {
    const email = new UserEmail('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should convert to lowercase', () => {
    const email = new UserEmail('TEST@EXAMPLE.COM');
    expect(email.value).toBe('test@example.com');
  });

  it('should trim whitespace', () => {
    const email = new UserEmail('  test@example.com  ');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw error for empty email', () => {
    expect(() => new UserEmail('')).toThrow('Email cannot be empty');
  });

  it('should throw error for whitespace only email', () => {
    expect(() => new UserEmail('   ')).toThrow('Email cannot be empty');
  });

  it('should throw error for invalid email format', () => {
    expect(() => new UserEmail('invalid-email')).toThrow('Invalid email format');
  });

  it('should throw error for email without @', () => {
    expect(() => new UserEmail('testexample.com')).toThrow('Invalid email format');
  });

  it('should throw error for email without domain', () => {
    expect(() => new UserEmail('test@')).toThrow('Invalid email format');
  });

  it('should throw error for email too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    expect(() => new UserEmail(longEmail)).toThrow('Email cannot exceed 255 characters');
  });

  it('should accept valid email with exactly 255 characters', () => {
    const longEmail = 'a'.repeat(240) + '@example.com';
    const email = new UserEmail(longEmail);
    expect(email.value).toBe(longEmail.toLowerCase());
  });

  it('should return string representation', () => {
    const email = new UserEmail('test@example.com');
    expect(email.toString()).toBe('test@example.com');
  });

  it('should compare equality correctly', () => {
    const email1 = new UserEmail('test@example.com');
    const email2 = new UserEmail('test@example.com');
    const email3 = new UserEmail('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});
