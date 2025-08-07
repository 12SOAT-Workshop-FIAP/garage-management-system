import { randomUUID } from 'crypto';

/**
 * WorkOrder Domain Entity
 * Represents a work order in the garage (Ordem de Serviço da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property description - Work order description
 * @property created_at - Creation timestamp
 */
export class WorkOrder {
  id: string;
  description: string;
  created_at: Date;

  constructor(props: { description: string }, id?: string) {
    this.id = id ?? randomUUID();
    this.description = props.description;
    this.created_at = new Date();
  }

  // TODO: Add Value Objects and domain methods
}
