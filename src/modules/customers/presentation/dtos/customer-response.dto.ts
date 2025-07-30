import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * CustomerResponseDto
 * Data Transfer Object for customer response (Cliente da oficina).
 */
export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer unique identifier' })
  @Expose()
  id!: number;

  @ApiProperty({ description: "Customer's full name" })
  @Expose()
  name!: string;

  @ApiProperty({ enum: ['INDIVIDUAL', 'COMPANY'], description: 'Type of person' })
  @Expose()
  personType!: 'INDIVIDUAL' | 'COMPANY';

  @ApiProperty({ description: 'CPF or CNPJ document number' })
  @Expose()
  document!: string;

  @ApiProperty({ description: 'Customer email address', required: false })
  @Expose()
  email?: string;

  @ApiProperty({ description: 'Customer phone number' })
  @Expose()
  phone!: string;

  @ApiProperty({ description: 'Customer vehicles list' })
  @Expose()
  vehicles?: Vehicle[];

  @ApiProperty({ description: 'Customer creation date', type: String, format: 'date-time' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Customer last update date', type: String, format: 'date-time' })
  @Expose()
  updatedAt!: Date;

  @ApiProperty({ description: 'Customer status', type: 'boolean' })
  @Expose()
  status!: boolean;

  constructor({
    id,
    name,
    personType,
    document,
    phone,
    email,
    createdAt,
    updatedAt,
    status = true,
    vehicles,
  }: {
    id: number;
    name: string;
    personType: 'INDIVIDUAL' | 'COMPANY';
    document: string;
    phone: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    vehicles?: Vehicle[];
  }) {
    this.id = id;
    this.name = name;
    this.personType = personType;
    this.document = document;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.status = status;
    this.vehicles = vehicles ?? [];
  }
}
