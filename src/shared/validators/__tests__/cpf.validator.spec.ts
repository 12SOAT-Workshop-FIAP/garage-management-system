import { CpfValidator } from '../cpf.validator';

describe('CpfValidator', () => {
  let validator: CpfValidator;

  beforeEach(() => {
    validator = new CpfValidator();
  });

  describe('validate', () => {
    it('should return true for valid CPF without formatting', () => {
      // Valid CPF: 11144477735
      expect(validator.validate('11144477735', {} as any)).toBe(true);
    });

    it('should return true for valid CPF with formatting', () => {
      // Valid CPF: 111.444.777-35
      expect(validator.validate('111.444.777-35', {} as any)).toBe(true);
    });

    it('should return false for invalid CPF with wrong checksum', () => {
      expect(validator.validate('11144477736', {} as any)).toBe(false);
    });

    it('should return false for CPF with all same digits', () => {
      expect(validator.validate('11111111111', {} as any)).toBe(false);
      expect(validator.validate('00000000000', {} as any)).toBe(false);
    });

    it('should return false for CPF with wrong length', () => {
      expect(validator.validate('1114447773', {} as any)).toBe(false); // 10 digits
      expect(validator.validate('111444777355', {} as any)).toBe(false); // 12 digits
    });

    it('should return false for empty or null CPF', () => {
      expect(validator.validate('', {} as any)).toBe(false);
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
    });

    it('should return false for CPF with letters', () => {
      expect(validator.validate('111444777AB', {} as any)).toBe(false);
    });

    it('should handle various formatting correctly', () => {
      const validCpf = '11144477735';
      expect(validator.validate('111.444.777-35', {} as any)).toBe(true);
      expect(validator.validate('111 444 777 35', {} as any)).toBe(true);
      expect(validator.validate('111-444-777-35', {} as any)).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = validator.defaultMessage({} as any);
      expect(message).toBe('Invalid CPF format or checksum');
    });
  });
});
