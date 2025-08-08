import { registerDecorator, ValidationOptions } from 'class-validator';
import { LicensePlateValidator } from './license-plate.validator';

/**
 * Decorator for validating Brazilian license plates
 * @param validationOptions - Optional validation options
 * @returns PropertyDecorator
 * 
 * @example
 * class CreateVehicleDto {
 *   @IsValidLicensePlate()
 *   plate: string;
 * }
 */
export function IsValidLicensePlate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidLicensePlate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: LicensePlateValidator,
    });
  };
}
