import { CnpjValidator } from '../cnpj.validator';

describe('CnpjValidator', () => {
  let validator: CnpjValidator;

  beforeEach(() => {
    validator = new CnpjValidator();
  });

  describe('validate', () => {
    it('should return true for valid CNPJ without formatting', () => {
      // Valid CNPJ: 11222333000181
      expect(validator.validate('11222333000181', {} as any)).toBe(true);
    });

    it('should return true for valid CNPJ with formatting', () => {
      // Valid CNPJ: 11.222.333/0001-81
      expect(validator.validate('11.222.333/0001-81', {} as any)).toBe(true);
    });

    it('should return false for invalid CNPJ with wrong checksum', () => {
      expect(validator.validate('11222333000182', {} as any)).toBe(false);
    });

    it('should return false for CNPJ with all same digits', () => {
      expect(validator.validate('11111111111111', {} as any)).toBe(false);
      expect(validator.validate('00000000000000', {} as any)).toBe(false);
    });

    it('should return false for CNPJ with wrong length', () => {
      expect(validator.validate('1122233300018', {} as any)).toBe(false); // 13 digits
      expect(validator.validate('112223330001811', {} as any)).toBe(false); // 15 digits
    });

    it('should return false for empty or null CNPJ', () => {
      expect(validator.validate('', {} as any)).toBe(false);
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
    });

    it('should return false for CNPJ with letters', () => {
      expect(validator.validate('112223330001AB', {} as any)).toBe(false);
    });

    it('should handle various formatting correctly', () => {
      expect(validator.validate('11.222.333/0001-81', {} as any)).toBe(true);
      expect(validator.validate('11 222 333 0001 81', {} as any)).toBe(true);
      expect(validator.validate('11-222-333-0001-81', {} as any)).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = validator.defaultMessage({} as any);
      expect(message).toBe('Invalid CNPJ format or checksum');
    });
  });
});
