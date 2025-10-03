import { UserId } from '../user-id.vo';

describe('UserId', () => {
  it('should create a valid user ID', () => {
    const userId = new UserId('12345678-1234-1234-1234-123456789012');
    expect(userId.value).toBe('12345678-1234-1234-1234-123456789012');
  });

  it('should throw error for empty ID', () => {
    expect(() => new UserId('')).toThrow('User ID cannot be empty');
  });

  it('should throw error for whitespace only ID', () => {
    expect(() => new UserId('   ')).toThrow('User ID cannot be empty');
  });

  it('should trim whitespace', () => {
    const userId = new UserId('  12345678-1234-1234-1234-123456789012  ');
    expect(userId.value).toBe('12345678-1234-1234-1234-123456789012');
  });

  it('should return string representation', () => {
    const userId = new UserId('12345678-1234-1234-1234-123456789012');
    expect(userId.toString()).toBe('12345678-1234-1234-1234-123456789012');
  });

  it('should compare equality correctly', () => {
    const id1 = new UserId('12345678-1234-1234-1234-123456789012');
    const id2 = new UserId('12345678-1234-1234-1234-123456789012');
    const id3 = new UserId('87654321-4321-4321-4321-210987654321');

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});
