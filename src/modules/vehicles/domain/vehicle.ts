import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Vehicle (Veículo)
 * Represents a vehicle in the garage (Veículo da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property licensePlate - Vehicle's license plate
 * @property created_at - Creation timestamp
 */
export class Vehicle {
  id!: number;
  brand: string;

  constructor({ brand }: { brand: string }) {
    this.brand = brand;
  }
  // TODO: Add Value Objects and domain methods
}
