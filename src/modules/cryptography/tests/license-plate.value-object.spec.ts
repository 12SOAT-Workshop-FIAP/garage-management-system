import { LicensePlate } from '../domain/value-objects/license-plate.value-object';

describe('LicensePlate', () => {
  describe('constructor', () => {
    it('should create LicensePlate with value and encrypted value', () => {
      const value = 'ABC1D23';
      const encryptedValue = 'encrypted-plate';
      const plate = new LicensePlate(value, encryptedValue);

      expect(plate.value).toBe(value);
      expect(plate.encryptedValue).toBe(encryptedValue);
    });

    it('should create LicensePlate with only value', () => {
      const value = 'ABC1D23';
      const plate = new LicensePlate(value);

      expect(plate.value).toBe(value);
      expect(plate.encryptedValue).toBe(value);
    });
  });

  describe('validate', () => {
    it('should validate valid old format license plate', () => {
      const validOldPlates = [
        'ABC1234',
        'XYZ9876',
        'DEF5678',
        'GHI9012',
      ];

      validOldPlates.forEach(plateValue => {
        const plate = new LicensePlate(plateValue);
        expect(plate.validate()).toBe(true);
      });
    });

    it('should validate valid Mercosul format license plate', () => {
      const validMercosulPlates = [
        'ABC1D23',
        'XYZ9A87',
        'DEF5B67',
        'GHI9C12',
      ];

      validMercosulPlates.forEach(plateValue => {
        const plate = new LicensePlate(plateValue);
        expect(plate.validate()).toBe(true);
      });
    });

    it('should reject invalid license plate with wrong length', () => {
      const invalidPlates = [
        'ABC123', // 6 characters
        'ABC12345', // 8 characters
        'ABC', // 3 characters
      ];

      invalidPlates.forEach(plateValue => {
        const plate = new LicensePlate(plateValue);
        expect(plate.validate()).toBe(false);
      });
    });

    it('should reject license plate with invalid characters', () => {
      const invalidPlates = [
        'ABC123!',
        'ABC123@',
        'ABC123#',
        'ABC123$',
      ];

      invalidPlates.forEach(plateValue => {
        const plate = new LicensePlate(plateValue);
        expect(plate.validate()).toBe(false);
      });
    });

    it('should reject old format with letter in wrong position', () => {
      const invalidPlates = [
        'A1C1234',
        'AB1234',
        'ABC123A',
      ];

      invalidPlates.forEach(plateValue => {
        const plate = new LicensePlate(plateValue);
        expect(plate.validate()).toBe(false);
      });
    });

    it('should reject invalid license plates that match neither format', () => {
      const invalidPlates = [
        'ABC123', // Too short
        'ABC12345', // Too long
        'ABC123!', // Invalid character
        'ABC123@', // Invalid character
      ];

      invalidPlates.forEach(plateValue => {
        const plate = new LicensePlate(plateValue);
        expect(plate.validate()).toBe(false);
      });
    });

    it('should correctly validate Mercosul format with proper character types', () => {
      // Valid Mercosul: 3 letters + 1 digit + 1 letter + 2 digits
      const validMercosul = new LicensePlate('ABC1D23');
      expect(validMercosul.validate()).toBe(true);
      expect(validMercosul.getPlateType()).toBe('mercosul');

      // Valid Mercosul: Another valid example
      const validMercosul2 = new LicensePlate('ABC1A23');
      expect(validMercosul2.validate()).toBe(true);
      expect(validMercosul2.getPlateType()).toBe('mercosul');

      // Valid Old Format: 3 letters + 4 digits
      const validOld = new LicensePlate('ABC1234');
      expect(validOld.validate()).toBe(true);
      expect(validOld.getPlateType()).toBe('old');

      // Invalid: Wrong character types for both formats
      const invalidPlate = new LicensePlate('ABC1A2A'); // Last character should be digit
      expect(invalidPlate.validate()).toBe(false);
    });

    it('should handle license plate with formatting', () => {
      const formattedPlate = 'ABC-1234';
      const plate = new LicensePlate(formattedPlate);
      expect(plate.validate()).toBe(true);
    });

    it('should handle lowercase license plate', () => {
      const lowercasePlate = 'abc1234';
      const plate = new LicensePlate(lowercasePlate);
      expect(plate.validate()).toBe(true);
    });

    it('should handle mixed case license plate', () => {
      const mixedPlate = 'AbC1234';
      const plate = new LicensePlate(mixedPlate);
      expect(plate.validate()).toBe(true);
    });
  });

  describe('withEncryptedValue', () => {
    it('should create new LicensePlate with encrypted value', () => {
      const originalPlate = new LicensePlate('ABC1D23');
      const encryptedValue = 'encrypted-plate';
      const newPlate = originalPlate.withEncryptedValue(encryptedValue);

      expect(newPlate).toBeInstanceOf(LicensePlate);
      expect(newPlate.value).toBe(originalPlate.value);
      expect(newPlate.encryptedValue).toBe(encryptedValue);
      expect(newPlate).not.toBe(originalPlate); // Should be a new instance
    });
  });

  describe('getMaskedValue', () => {
    it('should return masked old format license plate', () => {
      const plate = new LicensePlate('ABC1234');
      const masked = plate.getMaskedValue();

      expect(masked).toBe('***1234');
    });

    it('should return masked Mercosul format license plate', () => {
      const plate = new LicensePlate('ABC1D23');
      const masked = plate.getMaskedValue();

      expect(masked).toBe('***1D23');
    });

    it('should handle license plate with formatting', () => {
      const plate = new LicensePlate('ABC-1234');
      const masked = plate.getMaskedValue();

      expect(masked).toBe('***1234');
    });

    it('should return default mask for invalid plate', () => {
      const plate = new LicensePlate('INVALID');
      const masked = plate.getMaskedValue();

      expect(masked).toBe('*******');
    });
  });

  describe('getFormattedValue', () => {
    it('should return formatted old format license plate', () => {
      const plate = new LicensePlate('ABC1234');
      const formatted = plate.getFormattedValue();

      expect(formatted).toBe('ABC-1234');
    });

    it('should return formatted Mercosul format license plate', () => {
      const plate = new LicensePlate('ABC1D23');
      const formatted = plate.getFormattedValue();

      expect(formatted).toBe('ABC-1D23');
    });

    it('should handle already formatted old plate', () => {
      const plate = new LicensePlate('ABC-1234');
      const formatted = plate.getFormattedValue();

      expect(formatted).toBe('ABC-1234');
    });

    it('should handle already formatted Mercosul plate', () => {
      const plate = new LicensePlate('ABC-1D23');
      const formatted = plate.getFormattedValue();

      expect(formatted).toBe('ABC-1D23');
    });

    it('should return original value for invalid plate', () => {
      const plate = new LicensePlate('INVALID');
      const formatted = plate.getFormattedValue();

      expect(formatted).toBe('INVALID');
    });
  });

  describe('getPlateType', () => {
    it('should return "old" for old format plate', () => {
      const plate = new LicensePlate('ABC1234');
      const type = plate.getPlateType();

      expect(type).toBe('old');
    });

    it('should return "mercosul" for Mercosul format plate', () => {
      const plate = new LicensePlate('ABC1D23');
      const type = plate.getPlateType();

      expect(type).toBe('mercosul');
    });

    it('should return "invalid" for invalid plate', () => {
      const plate = new LicensePlate('INVALID');
      const type = plate.getPlateType();

      expect(type).toBe('invalid');
    });

    it('should handle lowercase plate', () => {
      const plate = new LicensePlate('abc1234');
      const type = plate.getPlateType();

      expect(type).toBe('old');
    });

    it('should handle mixed case plate', () => {
      const plate = new LicensePlate('AbC1D23');
      const type = plate.getPlateType();

      expect(type).toBe('mercosul');
    });
  });

  describe('equals', () => {
    it('should return true for equal license plates', () => {
      const plate1 = new LicensePlate('ABC1234');
      const plate2 = new LicensePlate('ABC1234');

      expect(plate1.equals(plate2)).toBe(true);
    });

    it('should return false for different license plates', () => {
      const plate1 = new LicensePlate('ABC1234');
      const plate2 = new LicensePlate('XYZ9876');

      expect(plate1.equals(plate2)).toBe(false);
    });

    it('should return true for same plate with different formatting', () => {
      const plate1 = new LicensePlate('ABC1234');
      const plate2 = new LicensePlate('ABC-1234');

      expect(plate1.equals(plate2)).toBe(true);
    });

    it('should return true for same plate with different case', () => {
      const plate1 = new LicensePlate('ABC1234');
      const plate2 = new LicensePlate('abc1234');

      expect(plate1.equals(plate2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return masked value for old format', () => {
      const plate = new LicensePlate('ABC1234');
      const result = plate.toString();

      expect(result).toBe('***1234');
    });

    it('should return masked value for Mercosul format', () => {
      const plate = new LicensePlate('ABC1D23');
      const result = plate.toString();

      expect(result).toBe('***1D23');
    });
  });
});
