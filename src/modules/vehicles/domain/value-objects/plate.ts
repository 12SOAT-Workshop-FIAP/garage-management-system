import { DomainError } from '../errors/domain-error';

export class Plate {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  // Padrões Brasil (ex.: ABC-1234) e Mercosul (ex.: ABC1D23)
  private static readonly REGEX_NORMAL = /^[A-Z]{3}-?\d{4}$/;
  private static readonly REGEX_MERCOSUL = /^[A-Z]{3}\d[A-Z]\d{2}$/;

  private static normalize(raw: string): string {
    return raw.toUpperCase().replace(/\s+/g, '');
  }

  static create(raw: string): Plate {
    const v = Plate.normalize(raw);

    const isNormal = Plate.REGEX_NORMAL.test(v);
    const isMercosul = Plate.REGEX_MERCOSUL.test(v);

    if (!isNormal && !isMercosul) {
      throw new DomainError('INVALID_PLATE', 'Placa inválida. Formato aceito: ABC-1234 ou ABC1D23.');
    }

    // Normaliza para formato sem hífen 
    const normalized = v.replace('-', '');
    return new Plate(normalized);
  }
}
