import { CNPJ } from '../domain/value-objects/cnpj.value-object';

describe('CNPJ', () => {
  describe('constructor', () => {
    it('should create CNPJ with value and encrypted value', () => {
      const value = '12345678000195';
      const encryptedValue = 'encrypted-cnpj';
      const cnpj = new CNPJ(value, encryptedValue);

      expect(cnpj.value).toBe(value);
      expect(cnpj.encryptedValue).toBe(encryptedValue);
    });

    it('should create CNPJ with only value', () => {
      const value = '12345678000195';
      const cnpj = new CNPJ(value);

      expect(cnpj.value).toBe(value);
      expect(cnpj.encryptedValue).toBe(value);
    });
  });

  describe('validate', () => {
    it('should validate valid CNPJ', () => {
      // These are known valid CNPJ numbers
      const validCNPJs = ['12345678000195', '11111111000191'];

      validCNPJs.forEach((cnpjValue) => {
        const cnpj = new CNPJ(cnpjValue);
        expect(cnpj.validate()).toBe(true);
      });
    });

    it('should reject invalid CNPJ with wrong length', () => {
      const invalidCNPJs = [
        '1234567800019', // 13 digits
        '123456780001951', // 15 digits
        '123456780001', // 12 digits
      ];

      invalidCNPJs.forEach((cnpjValue) => {
        const cnpj = new CNPJ(cnpjValue);
        expect(cnpj.validate()).toBe(false);
      });
    });

    it('should reject CNPJ with non-numeric characters', () => {
      const invalidCNPJs = ['1234567800019a', '1234567800019.', '1234567800019-'];

      invalidCNPJs.forEach((cnpjValue) => {
        const cnpj = new CNPJ(cnpjValue);
        expect(cnpj.validate()).toBe(false);
      });
    });

    it('should reject CNPJ with all repeated digits', () => {
      const invalidCNPJs = [
        '11111111111111',
        '22222222222222',
        '33333333333333',
        '44444444444444',
        '55555555555555',
        '66666666666666',
        '77777777777777',
        '88888888888888',
        '99999999999999',
        '00000000000000',
      ];

      invalidCNPJs.forEach((cnpjValue) => {
        const cnpj = new CNPJ(cnpjValue);
        expect(cnpj.validate()).toBe(false);
      });
    });

    it('should reject CNPJ with invalid check digits', () => {
      const invalidCNPJs = [
        '12345678000190', // Invalid first check digit
        '12345678000196', // Invalid second check digit
        '12345678000197', // Invalid both check digits
      ];

      invalidCNPJs.forEach((cnpjValue) => {
        const cnpj = new CNPJ(cnpjValue);
        expect(cnpj.validate()).toBe(false);
      });
    });

    it('should handle CNPJ with formatting characters', () => {
      const formattedCNPJ = '12.345.678/0001-95';
      const cnpj = new CNPJ(formattedCNPJ);
      expect(cnpj.validate()).toBe(true);
    });
  });

  describe('withEncryptedValue', () => {
    it('should create new CNPJ with encrypted value', () => {
      const originalCNPJ = new CNPJ('12345678000195');
      const encryptedValue = 'encrypted-cnpj';
      const newCNPJ = originalCNPJ.withEncryptedValue(encryptedValue);

      expect(newCNPJ).toBeInstanceOf(CNPJ);
      expect(newCNPJ.value).toBe(originalCNPJ.value);
      expect(newCNPJ.encryptedValue).toBe(encryptedValue);
      expect(newCNPJ).not.toBe(originalCNPJ); // Should be a new instance
    });
  });

  describe('getMaskedValue', () => {
    it('should return masked CNPJ', () => {
      const cnpj = new CNPJ('12345678000195');
      const masked = cnpj.getMaskedValue();

      expect(masked).toBe('**.***.***/****-95');
    });

    it('should handle CNPJ with formatting', () => {
      const cnpj = new CNPJ('12.345.678/0001-95');
      const masked = cnpj.getMaskedValue();

      expect(masked).toBe('**.***.***/****-95');
    });
  });

  describe('getFormattedValue', () => {
    it('should return formatted CNPJ', () => {
      const cnpj = new CNPJ('12345678000195');
      const formatted = cnpj.getFormattedValue();

      expect(formatted).toBe('12.345.678/0001-95');
    });

    it('should handle already formatted CNPJ', () => {
      const cnpj = new CNPJ('12.345.678/0001-95');
      const formatted = cnpj.getFormattedValue();

      expect(formatted).toBe('12.345.678/0001-95');
    });
  });

  describe('equals', () => {
    it('should return true for equal CNPJs', () => {
      const cnpj1 = new CNPJ('12345678000195');
      const cnpj2 = new CNPJ('12345678000195');

      expect(cnpj1.equals(cnpj2)).toBe(true);
    });

    it('should return false for different CNPJs', () => {
      const cnpj1 = new CNPJ('12345678000195');
      const cnpj2 = new CNPJ('11111111000191');

      expect(cnpj1.equals(cnpj2)).toBe(false);
    });

    it('should return true for same CNPJ with different formatting', () => {
      const cnpj1 = new CNPJ('12345678000195');
      const cnpj2 = new CNPJ('12.345.678/0001-95');

      expect(cnpj1.equals(cnpj2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return masked value', () => {
      const cnpj = new CNPJ('12345678000195');
      const result = cnpj.toString();

      expect(result).toBe('**.***.***/****-95');
    });
  });
});
