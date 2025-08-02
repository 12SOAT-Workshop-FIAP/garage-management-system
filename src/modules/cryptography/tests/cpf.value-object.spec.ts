import { CPF } from '../domain/value-objects/cpf.value-object';

describe('CPF', () => {
  describe('constructor', () => {
    it('should create CPF with value and encrypted value', () => {
      const value = '11144477735';
      const encryptedValue = 'encrypted-cpf';
      const cpf = new CPF(value, encryptedValue);

      expect(cpf.value).toBe(value);
      expect(cpf.encryptedValue).toBe(encryptedValue);
    });

    it('should create CPF with only value', () => {
      const value = '11144477735';
      const cpf = new CPF(value);

      expect(cpf.value).toBe(value);
      expect(cpf.encryptedValue).toBe(value);
    });
  });

  describe('validate', () => {
    it('should validate valid CPF', () => {
      // These are known valid CPF numbers
      const validCPFs = ['11144477735', '12345678909', '98765432100'];

      validCPFs.forEach((cpfValue) => {
        const cpf = new CPF(cpfValue);
        expect(cpf.validate()).toBe(true);
      });
    });

    it('should reject invalid CPF with wrong length', () => {
      const invalidCPFs = [
        '1234567890', // 10 digits
        '123456789012', // 12 digits
        '123456789', // 9 digits
      ];

      invalidCPFs.forEach((cpfValue) => {
        const cpf = new CPF(cpfValue);
        expect(cpf.validate()).toBe(false);
      });
    });

    it('should reject CPF with non-numeric characters', () => {
      const invalidCPFs = ['1234567890a', '1234567890.', '1234567890-'];

      invalidCPFs.forEach((cpfValue) => {
        const cpf = new CPF(cpfValue);
        expect(cpf.validate()).toBe(false);
      });
    });

    it('should reject CPF with all repeated digits', () => {
      const invalidCPFs = [
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
        '00000000000',
      ];

      invalidCPFs.forEach((cpfValue) => {
        const cpf = new CPF(cpfValue);
        expect(cpf.validate()).toBe(false);
      });
    });

    it('should reject CPF with invalid check digits', () => {
      const invalidCPFs = [
        '12345678900', // Invalid first check digit
        '12345678910', // Invalid second check digit
        '12345678902', // Invalid both check digits
      ];

      invalidCPFs.forEach((cpfValue) => {
        const cpf = new CPF(cpfValue);
        expect(cpf.validate()).toBe(false);
      });
    });

    it('should handle CPF with formatting characters', () => {
      const formattedCPF = '111.444.777-35';
      const cpf = new CPF(formattedCPF);
      expect(cpf.validate()).toBe(true);
    });
  });

  describe('withEncryptedValue', () => {
    it('should create new CPF with encrypted value', () => {
      const originalCPF = new CPF('11144477735');
      const encryptedValue = 'encrypted-cpf';
      const newCPF = originalCPF.withEncryptedValue(encryptedValue);

      expect(newCPF).toBeInstanceOf(CPF);
      expect(newCPF.value).toBe(originalCPF.value);
      expect(newCPF.encryptedValue).toBe(encryptedValue);
      expect(newCPF).not.toBe(originalCPF); // Should be a new instance
    });
  });

  describe('getMaskedValue', () => {
    it('should return masked CPF', () => {
      const cpf = new CPF('11144477735');
      const masked = cpf.getMaskedValue();

      expect(masked).toBe('***.***.***-35');
    });

    it('should handle CPF with formatting', () => {
      const cpf = new CPF('111.444.777-35');
      const masked = cpf.getMaskedValue();

      expect(masked).toBe('***.***.***-35');
    });
  });

  describe('getFormattedValue', () => {
    it('should return formatted CPF', () => {
      const cpf = new CPF('11144477735');
      const formatted = cpf.getFormattedValue();

      expect(formatted).toBe('111.444.777-35');
    });

    it('should handle already formatted CPF', () => {
      const cpf = new CPF('111.444.777-35');
      const formatted = cpf.getFormattedValue();

      expect(formatted).toBe('111.444.777-35');
    });
  });

  describe('equals', () => {
    it('should return true for equal CPFs', () => {
      const cpf1 = new CPF('11144477735');
      const cpf2 = new CPF('11144477735');

      expect(cpf1.equals(cpf2)).toBe(true);
    });

    it('should return false for different CPFs', () => {
      const cpf1 = new CPF('11144477735');
      const cpf2 = new CPF('12345678909');

      expect(cpf1.equals(cpf2)).toBe(false);
    });

    it('should return true for same CPF with different formatting', () => {
      const cpf1 = new CPF('11144477735');
      const cpf2 = new CPF('111.444.777-35');

      expect(cpf1.equals(cpf2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return masked value', () => {
      const cpf = new CPF('11144477735');
      const result = cpf.toString();

      expect(result).toBe('***.***.***-35');
    });
  });
});
