import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { LicensePlate } from '@modules/cryptography/domain/value-objects/license-plate.value-object';

/**
 * Custom validator for Brazilian license plates
 * Supports both old format (ABC-1234) and Mercosul format (ABC-1D23)
 */
@ValidatorConstraint({ name: 'isValidLicensePlate', async: false })
export class LicensePlateValidator implements ValidatorConstraintInterface {
  validate(plateValue: string, args: ValidationArguments): boolean {
    if (!plateValue || typeof plateValue !== 'string') {
      return false;
    }

    try {
      const plate = new LicensePlate(plateValue);
      return plate.validate();
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return 'License plate must be in valid Brazilian format (old: ABC-1234 or Mercosul: ABC-1D23)';
  }
}
