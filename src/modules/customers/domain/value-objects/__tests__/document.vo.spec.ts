import { Document } from '../document.vo';

describe('Document', () => {
  describe('CPF validation', () => {
    it('should create a valid CPF', () => {
      const cpf = new Document('11144477735');
      expect(cpf.value).toBe('11144477735');
      expect(cpf.type).toBe('cpf');
      expect(cpf.isCPF).toBe(true);
      expect(cpf.isCNPJ).toBe(false);
    });

    it('should format CPF correctly', () => {
      const cpf = new Document('11144477735');
      expect(cpf.formatted).toBe('111.444.777-35');
    });

    it('should mask CPF correctly', () => {
      const cpf = new Document('11144477735');
      expect(cpf.masked).toBe('***.***.***-**');
    });

    it('should accept CPF with formatting', () => {
      const cpf = new Document('111.444.777-35');
      expect(cpf.value).toBe('11144477735');
    });

    it('should throw error for invalid CPF', () => {
      expect(() => new Document('12345678901')).toThrow('Invalid CPF format');
    });

    it('should throw error for CPF with all same digits', () => {
      expect(() => new Document('11111111111')).toThrow('Invalid CPF format');
    });
  });

  describe('CNPJ validation', () => {
    it('should create a valid CNPJ', () => {
      const cnpj = new Document('11222333000181');
      expect(cnpj.value).toBe('11222333000181');
      expect(cnpj.type).toBe('cnpj');
      expect(cnpj.isCPF).toBe(false);
      expect(cnpj.isCNPJ).toBe(true);
    });

    it('should format CNPJ correctly', () => {
      const cnpj = new Document('11222333000181');
      expect(cnpj.formatted).toBe('11.222.333/0001-81');
    });

    it('should mask CNPJ correctly', () => {
      const cnpj = new Document('11222333000181');
      expect(cnpj.masked).toBe('**.***.***/****-**');
    });

    it('should accept CNPJ with formatting', () => {
      const cnpj = new Document('11.222.333/0001-81');
      expect(cnpj.value).toBe('11222333000181');
    });

    it('should throw error for invalid CNPJ', () => {
      expect(() => new Document('12345678000100')).toThrow('Invalid CNPJ format');
    });
  });

  describe('General validation', () => {
    it('should throw error for empty document', () => {
      expect(() => new Document('')).toThrow('Document cannot be empty');
    });

    it('should throw error for invalid length', () => {
      expect(() => new Document('123456789')).toThrow(
        'Document must have 11 digits (CPF) or 14 digits (CNPJ)',
      );
    });

    it('should return string representation', () => {
      const cpf = new Document('11144477735');
      expect(cpf.toString()).toBe('11144477735');
    });

    it('should compare equality correctly', () => {
      const doc1 = new Document('11144477735');
      const doc2 = new Document('11144477735');
      const doc3 = new Document('11222333000181');

      expect(doc1.equals(doc2)).toBe(true);
      expect(doc1.equals(doc3)).toBe(false);
    });
  });
});
