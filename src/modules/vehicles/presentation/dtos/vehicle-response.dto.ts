import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Vehicle } from '../../domain/vehicle.entity';
import { Customer } from '@modules/customers/domain/entities/customer.entity';

export class VehicleResponseDto {
  @ApiProperty({ description: 'Vehicle unique identifier' })
  @Expose()
  id!: number;

  @ApiProperty({ description: "Vehicle's license plate" })
  @Expose()
  brand!: string;

  @ApiProperty({ description: 'Vehicle model' })
  @Expose()
  model!: string;

  @ApiProperty({ description: 'Vehicle plate' })
  @Expose()
  plate!: string;

  @ApiProperty({ description: 'Vehicle model year' })
  @Expose()
  year!: number;

  @ApiProperty({ description: 'Customer ID (FK)' })
  @Expose()
  customer!: Customer;

  @ApiProperty({ description: 'Creation Timestamp' })
  @Expose()
  created_at!: Date;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.brand = vehicle.brand;
    this.model = vehicle.model;
    this.plate = vehicle.plate;
    this.year = vehicle.year;
    this.customer = vehicle.customer as any; // Type compatibility issue - needs refactoring
    this.created_at = vehicle.created_at;
  }
}
