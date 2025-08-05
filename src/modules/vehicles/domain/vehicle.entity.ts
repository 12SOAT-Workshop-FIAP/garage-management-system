import { randomUUID } from 'crypto';

/**
 * Vehicle Domain Entity
 * Represents a vehicle in the garage (Veículo da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property licensePlate - Vehicle's license plate
 * @property created_at - Creation timestamp
 */
export class Vehicle {
  id: string;
  licensePlate: string;
  created_at: Date;

  constructor(props: { licensePlate: string }, id?: string) {
    this.id = id ?? randomUUID();
    this.licensePlate = props.licensePlate;
    this.created_at = new Date();
  }

  // TODO: Add Value Objects and domain methods
}
