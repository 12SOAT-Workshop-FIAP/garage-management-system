import { DomainError } from '../errors/domain-error';
import { Plate } from '../value-objects/plate';

export type VehicleId = number;

export interface VehicleProps {
  plate: Plate;
  brand: string;
  model: string;
  year: number;
  customerId: number;
  color?: string | null;
}

export class Vehicle {
  private constructor(
    readonly id: VehicleId | null,
    private props: VehicleProps,
  ) {}

  static createNew(props: VehicleProps): Vehicle {
    Vehicle.assertInvariants(props);
    return new Vehicle(null, props); // ainda sem id
}

  // Reidratação a partir do repositório
  static restore(id: VehicleId, props: VehicleProps): Vehicle {
    // mesmo check para garantir consistência
    Vehicle.assertInvariants(props);
    return new Vehicle(id, props);
  }

  // Regras de negócio básicas locais (as que não dependem de persistência)
  private static assertInvariants(p: VehicleProps) {
    if (!p.brand?.trim()) throw new DomainError('BRAND_REQUIRED', 'Marca é obrigatória.');
    if (!p.model?.trim()) throw new DomainError('MODEL_REQUIRED', 'Modelo é obrigatório.');
    if (p.year < 1900 || p.year > new Date().getFullYear() + 1) {
      throw new DomainError('INVALID_YEAR', 'Ano do veículo inválido.');
    }
    if (p.customerId == null) {
      throw new DomainError('CUSTOMER_REQUIRED', 'Veículo precisa estar associado a um cliente.');
    }
  }

  // Getters
  get plate(): Plate { return this.props.plate; }
  get brand(): string { return this.props.brand; }
  get model(): string { return this.props.model; }
  get year(): number { return this.props.year; }
  get customerId(): number { return this.props.customerId; }
  get color(): string | null | undefined { return this.props.color; }

  // Intenções de mudança controladas
  changeOwner(newCustomerId: number) {
    if (newCustomerId == null) throw new DomainError('CUSTOMER_REQUIRED', 'Novo cliente inválido.');
    this.props.customerId = newCustomerId;
  }

  updateSpecs(partial: Partial<Omit<VehicleProps, 'plate' | 'customerId'>>) {
    // placa e customerId não mudam aqui
    const next = { ...this.props, ...partial };
    Vehicle.assertInvariants(next);
    this.props = next;
  }

  changePlate(newPlate: Plate) {
    // permitido se sua regra de negócio aceitar troca de placa
    this.props.plate = newPlate;
  }

  // Snapshot para persistência/adaptação
  toPrimitives() {
    return {
      id: this.id,
      plate: this.plate.value,
      brand: this.brand,
      model: this.model,
      year: this.year,
      customerId: this.customerId,
      color: this.color ?? null,
    };
  }
}
