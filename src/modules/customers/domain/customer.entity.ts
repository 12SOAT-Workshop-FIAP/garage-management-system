import { randomUUID } from 'crypto';

/**
 * Customer Domain Entity
 * Represents a customer of the garage (Cliente da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property name - Customer's name
 * @property created_at - Creation timestamp
 */
export class Customer {
  id: string;
  name: string;
  created_at: Date;

  constructor(props: { name: string }, id?: string) {
    this.id = id ?? randomUUID();
    this.name = props.name;
    this.created_at = new Date();
  }

  // TODO: Add Value Objects and domain methods
}
