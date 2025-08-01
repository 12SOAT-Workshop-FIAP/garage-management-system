import { SensitiveData } from '../domain/value-objects/sensitive-data.value-object';

// Create a concrete implementation for testing the abstract class
class TestSensitiveData extends SensitiveData {
  validate(): boolean {
    return this._value.length > 0;
  }

  withEncryptedValue(encryptedValue: string): TestSensitiveData {
    return new TestSensitiveData(this._value, encryptedValue);
  }

  getMaskedValue(): string {
    return `***${this._value.slice(-2)}`;
  }

  getFormattedValue(): string {
    return this._value;
  }
}

describe('SensitiveData', () => {
  describe('constructor', () => {
    it('should create SensitiveData with value and encrypted value', () => {
      const value = 'test-value';
      const encryptedValue = 'encrypted-value';
      const data = new TestSensitiveData(value, encryptedValue);

      expect(data.value).toBe(value);
      expect(data.encryptedValue).toBe(encryptedValue);
    });

    it('should create SensitiveData with only value', () => {
      const value = 'test-value';
      const data = new TestSensitiveData(value);

      expect(data.value).toBe(value);
      expect(data.encryptedValue).toBe(value);
    });
  });

  describe('value getter', () => {
    it('should return the value', () => {
      const value = 'test-value';
      const data = new TestSensitiveData(value);

      expect(data.value).toBe(value);
    });
  });

  describe('encryptedValue getter', () => {
    it('should return the encrypted value', () => {
      const value = 'test-value';
      const encryptedValue = 'encrypted-value';
      const data = new TestSensitiveData(value, encryptedValue);

      expect(data.encryptedValue).toBe(encryptedValue);
    });

    it('should return the value when no encrypted value is provided', () => {
      const value = 'test-value';
      const data = new TestSensitiveData(value);

      expect(data.encryptedValue).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const data1 = new TestSensitiveData('test-value');
      const data2 = new TestSensitiveData('test-value');

      expect(data1.equals(data2)).toBe(true);
    });

    it('should return false for different values', () => {
      const data1 = new TestSensitiveData('test-value-1');
      const data2 = new TestSensitiveData('test-value-2');

      expect(data1.equals(data2)).toBe(false);
    });

    it('should return true for same value with different encrypted values', () => {
      const data1 = new TestSensitiveData('test-value', 'encrypted-1');
      const data2 = new TestSensitiveData('test-value', 'encrypted-2');

      expect(data1.equals(data2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return masked value', () => {
      const data = new TestSensitiveData('test-value');
      const result = data.toString();

      expect(result).toBe('***ue');
    });

    it('should return masked value for short input', () => {
      const data = new TestSensitiveData('ab');
      const result = data.toString();

      expect(result).toBe('***ab');
    });

    it('should return masked value for single character', () => {
      const data = new TestSensitiveData('a');
      const result = data.toString();

      expect(result).toBe('***a');
    });
  });

  describe('abstract methods', () => {
    it('should implement validate method', () => {
      const validData = new TestSensitiveData('test-value');
      const invalidData = new TestSensitiveData('');

      expect(validData.validate()).toBe(true);
      expect(invalidData.validate()).toBe(false);
    });

    it('should implement withEncryptedValue method', () => {
      const originalData = new TestSensitiveData('test-value');
      const encryptedValue = 'encrypted-value';
      const newData = originalData.withEncryptedValue(encryptedValue);

      expect(newData).toBeInstanceOf(TestSensitiveData);
      expect(newData.value).toBe(originalData.value);
      expect(newData.encryptedValue).toBe(encryptedValue);
      expect(newData).not.toBe(originalData);
    });

    it('should implement getMaskedValue method', () => {
      const data = new TestSensitiveData('test-value');
      const masked = data.getMaskedValue();

      expect(masked).toBe('***ue');
    });

    it('should implement getFormattedValue method', () => {
      const data = new TestSensitiveData('test-value');
      const formatted = data.getFormattedValue();

      expect(formatted).toBe('test-value');
    });
  });
});
