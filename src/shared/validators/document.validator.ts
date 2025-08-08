import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { CpfValidator } from './cpf.validator';
import { CnpjValidator } from './cnpj.validator';

/**
 * Document Validator
 * Validates CPF for INDIVIDUAL person type or CNPJ for COMPANY person type
 */
@ValidatorConstraint({ name: 'document', async: false })
export class DocumentValidator implements ValidatorConstraintInterface {
  private cpfValidator = new CpfValidator();
  private cnpjValidator = new CnpjValidator();

  validate(document: string, args: ValidationArguments): boolean {
    if (!document) return false;
    
    const object = args.object as any;
    const personType = object.personType;
    
    if (!personType) {
      return false; // personType is required for document validation
    }

    // Clean document (remove formatting)
    const cleanDocument = document.replace(/[^\d]/g, '');
    
    if (personType === 'INDIVIDUAL') {
      // For individuals, validate CPF (11 digits)
      return cleanDocument.length === 11 && this.cpfValidator.validate(document, args);
    } else if (personType === 'COMPANY') {
      // For companies, validate CNPJ (14 digits)
      return cleanDocument.length === 14 && this.cnpjValidator.validate(document, args);
    }
    
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as any;
    const personType = object.personType;
    
    if (personType === 'INDIVIDUAL') {
      return 'Document must be a valid CPF for individual customers';
    } else if (personType === 'COMPANY') {
      return 'Document must be a valid CNPJ for company customers';
    }
    
    return 'Invalid document format';
  }
}
