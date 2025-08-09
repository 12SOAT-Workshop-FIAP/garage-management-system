import { LicensePlateValidator } from '../license-plate.validator';
import { ValidationArguments } from 'class-validator';

describe('LicensePlateValidator', () => {
  let validator: LicensePlateValidator;
  let mockValidationArguments: ValidationArguments;

  beforeEach(() => {
    validator = new LicensePlateValidator();
    mockValidationArguments = {
      value: '',
      property: 'plate',
      object: {},
      constraints: [],
      targetName: 'TestClass',
    };
  });

  describe('validate', () => {
    it('should validate old format license plates', () => {
      const validOldPlates = [
        'ABC1234',
        'XYZ9876',
        'DEF5678',
        'abc1234', // lowercase
        'ABC-1234', // with dash
      ];

      validOldPlates.forEach(plate => {
        expect(validator.validate(plate, mockValidationArguments)).toBe(true);
      });
    });

    it('should validate Mercosul format license plates', () => {
      const validMercosulPlates = [
        'ABC1D23',
        'XYZ9A87',
        'DEF5B67',
        'abc1d23', // lowercase
        'ABC-1D23', // with dash
      ];

      validMercosulPlates.forEach(plate => {
        expect(validator.validate(plate, mockValidationArguments)).toBe(true);
      });
    });

    it('should reject invalid license plates', () => {
      const invalidPlates = [
        'ABC123', // too short
        'ABC12345', // too long
        'ABC123A', // invalid old format
        'ABC1A2A', // invalid Mercosul format
        '1234567', // all numbers
        'ABCDEFG', // all letters
        '', // empty
        '   ', // whitespace only
        'ABC123!', // special characters
      ];

      invalidPlates.forEach(plate => {
        expect(validator.validate(plate, mockValidationArguments)).toBe(false);
      });
    });

    it('should handle null and undefined values', () => {
      expect(validator.validate(null as any, mockValidationArguments)).toBe(false);
      expect(validator.validate(undefined as any, mockValidationArguments)).toBe(false);
    });

    it('should handle non-string values', () => {
      expect(validator.validate(123 as any, mockValidationArguments)).toBe(false);
      expect(validator.validate({} as any, mockValidationArguments)).toBe(false);
      expect(validator.validate([] as any, mockValidationArguments)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = validator.defaultMessage(mockValidationArguments);
      expect(message).toBe('License plate must be in valid Brazilian format (old: ABC-1234 or Mercosul: ABC-1D23)');
    });
  });
});
