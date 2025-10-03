import { UserPassword } from '../user-password.vo';

describe('UserPassword', () => {
  it('should create a valid password', () => {
    const password = new UserPassword('password123');
    expect(password.value).toBe('password123');
  });

  it('should throw error for empty password', () => {
    expect(() => new UserPassword('')).toThrow('Password cannot be empty');
  });

  it('should throw error for whitespace only password', () => {
    expect(() => new UserPassword('   ')).toThrow('Password cannot be empty');
  });

  it('should throw error for password too short', () => {
    expect(() => new UserPassword('12345')).toThrow('Password must have at least 6 characters');
  });

  it('should throw error for password too long', () => {
    const longPassword = 'a'.repeat(256);
    expect(() => new UserPassword(longPassword)).toThrow('Password cannot exceed 255 characters');
  });

  it('should accept password with exactly 6 characters', () => {
    const password = new UserPassword('123456');
    expect(password.value).toBe('123456');
  });

  it('should accept password with exactly 255 characters', () => {
    const password = new UserPassword('a'.repeat(255));
    expect(password.value).toBe('a'.repeat(255));
  });

  it('should return redacted string representation', () => {
    const password = new UserPassword('password123');
    expect(password.toString()).toBe('[REDACTED]');
  });

  it('should compare equality correctly', () => {
    const password1 = new UserPassword('password123');
    const password2 = new UserPassword('password123');
    const password3 = new UserPassword('different123');

    expect(password1.equals(password2)).toBe(true);
    expect(password1.equals(password3)).toBe(false);
  });
});
