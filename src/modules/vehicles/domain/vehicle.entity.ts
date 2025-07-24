import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Vehicle (Veículo)
 * Represents a vehicle in the garage (Veículo da oficina mecânica).
 *
 * @property id - Unique identifier (UUID)
 * @property licensePlate - Vehicle's license plate
 * @property created_at - Creation timestamp
 */
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  // TODO: Add Value Objects and domain methods
}
