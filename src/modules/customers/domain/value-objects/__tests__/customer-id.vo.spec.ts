import { CustomerId } from '../customer-id.vo';

describe('CustomerId', () => {
  it('should create a valid customer ID', () => {
    const customerId = new CustomerId(1);
    expect(customerId.value).toBe(1);
  });

  it('should throw error for invalid ID (zero)', () => {
    expect(() => new CustomerId(0)).toThrow('Customer ID must be a positive number');
  });

  it('should throw error for invalid ID (negative)', () => {
    expect(() => new CustomerId(-1)).toThrow('Customer ID must be a positive number');
  });

  it('should throw error for invalid ID (undefined)', () => {
    expect(() => new CustomerId(undefined as any)).toThrow('Customer ID must be a positive number');
  });

  it('should return string representation', () => {
    const customerId = new CustomerId(123);
    expect(customerId.toString()).toBe('123');
  });

  it('should compare equality correctly', () => {
    const id1 = new CustomerId(1);
    const id2 = new CustomerId(1);
    const id3 = new CustomerId(2);

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});
