import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

/**
 * CPF Validator
 * Validates Brazilian CPF (Cadastro de Pessoas Físicas) format and checksum
 */
@ValidatorConstraint({ name: 'cpf', async: false })
export class CpfValidator implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments): boolean {
    if (!cpf) return false;
    
    // Remove formatting (dots, hyphens, spaces)
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    
    // Must have exactly 11 digits
    if (cleanCpf.length !== 11) return false;
    
    // Check for known invalid CPFs (all same digits)
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validate CPF checksum algorithm
    return this.validateCpfChecksum(cleanCpf);
  }

  private validateCpfChecksum(cpf: string): boolean {
    // Calculate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    // Calculate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Invalid CPF format or checksum';
  }
}
