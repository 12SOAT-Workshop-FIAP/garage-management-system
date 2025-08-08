import { DocumentValidator } from '../document.validator';

describe('DocumentValidator', () => {
  let validator: DocumentValidator;

  beforeEach(() => {
    validator = new DocumentValidator();
  });

  describe('validate', () => {
    it('should return true for valid CPF when personType is INDIVIDUAL', () => {
      const args = {
        object: { personType: 'INDIVIDUAL' }
      } as any;
      
      expect(validator.validate('11144477735', args)).toBe(true);
      expect(validator.validate('111.444.777-35', args)).toBe(true);
    });

    it('should return true for valid CNPJ when personType is COMPANY', () => {
      const args = {
        object: { personType: 'COMPANY' }
      } as any;
      
      expect(validator.validate('11222333000181', args)).toBe(true);
      expect(validator.validate('11.222.333/0001-81', args)).toBe(true);
    });

    it('should return false for CPF when personType is COMPANY', () => {
      const args = {
        object: { personType: 'COMPANY' }
      } as any;
      
      expect(validator.validate('11144477735', args)).toBe(false);
    });

    it('should return false for CNPJ when personType is INDIVIDUAL', () => {
      const args = {
        object: { personType: 'INDIVIDUAL' }
      } as any;
      
      expect(validator.validate('11222333000181', args)).toBe(false);
    });

    it('should return false when personType is not provided', () => {
      const args = {
        object: {}
      } as any;
      
      expect(validator.validate('11144477735', args)).toBe(false);
      expect(validator.validate('11222333000181', args)).toBe(false);
    });

    it('should return false for invalid documents', () => {
      const individualArgs = {
        object: { personType: 'INDIVIDUAL' }
      } as any;
      
      const companyArgs = {
        object: { personType: 'COMPANY' }
      } as any;
      
      expect(validator.validate('11144477736', individualArgs)).toBe(false); // Invalid CPF
      expect(validator.validate('11222333000182', companyArgs)).toBe(false); // Invalid CNPJ
    });

    it('should return false for empty document', () => {
      const args = {
        object: { personType: 'INDIVIDUAL' }
      } as any;
      
      expect(validator.validate('', args)).toBe(false);
      expect(validator.validate(null as any, args)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return CPF message for INDIVIDUAL', () => {
      const args = {
        object: { personType: 'INDIVIDUAL' }
      } as any;
      
      const message = validator.defaultMessage(args);
      expect(message).toBe('Document must be a valid CPF for individual customers');
    });

    it('should return CNPJ message for COMPANY', () => {
      const args = {
        object: { personType: 'COMPANY' }
      } as any;
      
      const message = validator.defaultMessage(args);
      expect(message).toBe('Document must be a valid CNPJ for company customers');
    });

    it('should return generic message when personType is not provided', () => {
      const args = {
        object: {}
      } as any;
      
      const message = validator.defaultMessage(args);
      expect(message).toBe('Invalid document format');
    });
  });
});
