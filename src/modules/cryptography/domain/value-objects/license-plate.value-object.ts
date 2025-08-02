import { SensitiveData } from './sensitive-data.value-object';

export class LicensePlate extends SensitiveData {
  private static readonly MERCOSUL_PATTERN = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  private static readonly OLD_PATTERN = /^[A-Z]{3}[0-9]{4}$/;

  validate(): boolean {
    const cleanPlate = this.getCleanValue().toUpperCase();

    // Check if it matches either the new Mercosul format or the old format
    return (
      LicensePlate.MERCOSUL_PATTERN.test(cleanPlate) || LicensePlate.OLD_PATTERN.test(cleanPlate)
    );
  }

  withEncryptedValue(encryptedValue: string): LicensePlate {
    return new LicensePlate(this._value, encryptedValue);
  }

  getMaskedValue(): string {
    const cleanPlate = this.getCleanValue().toUpperCase();
    if (LicensePlate.MERCOSUL_PATTERN.test(cleanPlate)) {
      return cleanPlate.replace(/([A-Z]{3})([0-9])([A-Z])([0-9]{2})/, '***$2$3$4');
    } else if (LicensePlate.OLD_PATTERN.test(cleanPlate)) {
      return cleanPlate.replace(/([A-Z]{3})([0-9]{4})/, '***$2');
    }
    return '*******';
  }

  getFormattedValue(): string {
    const cleanPlate = this.getCleanValue().toUpperCase();
    if (LicensePlate.MERCOSUL_PATTERN.test(cleanPlate)) {
      return cleanPlate.replace(/([A-Z]{3})([0-9])([A-Z])([0-9]{2})/, '$1-$2$3$4');
    } else if (LicensePlate.OLD_PATTERN.test(cleanPlate)) {
      return cleanPlate.replace(/([A-Z]{3})([0-9]{4})/, '$1-$2');
    }
    return cleanPlate;
  }

  getPlateType(): 'mercosul' | 'old' | 'invalid' {
    const cleanPlate = this.getCleanValue().toUpperCase();

    if (LicensePlate.MERCOSUL_PATTERN.test(cleanPlate)) {
      return 'mercosul';
    } else if (LicensePlate.OLD_PATTERN.test(cleanPlate)) {
      return 'old';
    }
    return 'invalid';
  }

  private getCleanValue(): string {
    return this._value.replace(/[^A-Za-z0-9]/g, '');
  }
}
