import { CustomerName } from '../customer-name.vo';

describe('CustomerName', () => {
  it('should create a valid customer name', () => {
    const name = new CustomerName('João Silva');
    expect(name.value).toBe('João Silva');
  });

  it('should trim whitespace', () => {
    const name = new CustomerName('  João Silva  ');
    expect(name.value).toBe('João Silva');
  });

  it('should throw error for empty name', () => {
    expect(() => new CustomerName('')).toThrow('Customer name cannot be empty');
  });

  it('should throw error for whitespace only name', () => {
    expect(() => new CustomerName('   ')).toThrow('Customer name cannot be empty');
  });

  it('should throw error for name too short', () => {
    expect(() => new CustomerName('A')).toThrow('Customer name must have at least 2 characters');
  });

  it('should throw error for name too long', () => {
    const longName = 'A'.repeat(101);
    expect(() => new CustomerName(longName)).toThrow('Customer name cannot exceed 100 characters');
  });

  it('should accept name with exactly 2 characters', () => {
    const name = new CustomerName('Jo');
    expect(name.value).toBe('Jo');
  });

  it('should accept name with exactly 100 characters', () => {
    const name = new CustomerName('A'.repeat(100));
    expect(name.value).toBe('A'.repeat(100));
  });

  it('should return string representation', () => {
    const name = new CustomerName('João Silva');
    expect(name.toString()).toBe('João Silva');
  });

  it('should compare equality correctly', () => {
    const name1 = new CustomerName('João Silva');
    const name2 = new CustomerName('João Silva');
    const name3 = new CustomerName('Maria Santos');

    expect(name1.equals(name2)).toBe(true);
    expect(name1.equals(name3)).toBe(false);
  });
});
