import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

/**
 * CNPJ Validator
 * Validates Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) format and checksum
 */
@ValidatorConstraint({ name: 'cnpj', async: false })
export class CnpjValidator implements ValidatorConstraintInterface {
  validate(cnpj: string, args: ValidationArguments): boolean {
    if (!cnpj) return false;
    
    // Remove formatting (dots, slashes, hyphens, spaces)
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    
    // Must have exactly 14 digits
    if (cleanCnpj.length !== 14) return false;
    
    // Check for known invalid CNPJs (all same digits)
    if (/^(\d)\1{13}$/.test(cleanCnpj)) return false;
    
    // Validate CNPJ checksum algorithm
    return this.validateCnpjChecksum(cleanCnpj);
  }

  private validateCnpjChecksum(cnpj: string): boolean {
    // Calculate first check digit
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    // Calculate second check digit
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Invalid CNPJ format or checksum';
  }
}
