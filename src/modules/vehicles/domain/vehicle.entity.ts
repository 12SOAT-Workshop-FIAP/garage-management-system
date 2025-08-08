import { CustomerEntity } from '@modules/customers/infrastructure/customer.entity';
import { LicensePlate } from '@modules/cryptography/domain/value-objects/license-plate.value-object';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 50 })
  brand!: string;

  @Column({ length: 50 })
  model!: string;

  @Column({ unique: true, length: 8 })
  plate!: string;

  @Column({ type: 'int' })
  year!: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.vehicles)
  customer!: CustomerEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  /**
   * Format and validate license plate before saving
   */
  @BeforeInsert()
  @BeforeUpdate()
  formatLicensePlate() {
    if (this.plate) {
      const licensePlate = new LicensePlate(this.plate);
      if (!licensePlate.validate()) {
        throw new Error(`Invalid license plate format: ${this.plate}`);
      }
      // Store the formatted version
      this.plate = licensePlate.getFormattedValue();
    }
  }

  /**
   * Get license plate type (old or mercosul)
   */
  getLicensePlateType(): 'old' | 'mercosul' | 'invalid' {
    const licensePlate = new LicensePlate(this.plate);
    return licensePlate.getPlateType();
  }

  /**
   * Get masked license plate for security
   */
  getMaskedPlate(): string {
    const licensePlate = new LicensePlate(this.plate);
    return licensePlate.getMaskedValue();
  }
}
