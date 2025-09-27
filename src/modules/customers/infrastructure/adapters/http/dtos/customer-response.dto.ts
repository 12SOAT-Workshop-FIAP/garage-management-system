import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Customer } from '../../../../domain/entities/customer.entity';

export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer unique identifier' })
  @Expose()
  id!: number;

  @ApiProperty({ description: "Customer's name" })
  @Expose()
  name!: string;

  @ApiProperty({
    enum: ['INDIVIDUAL', 'COMPANY'],
    description: 'Type of person - INDIVIDUAL for CPF, COMPANY for CNPJ',
  })
  @Expose()
  personType!: 'INDIVIDUAL' | 'COMPANY';

  @ApiProperty({ description: 'CPF or CNPJ document' })
  @Expose()
  document!: string;

  @ApiProperty({ description: 'Customer phone number' })
  @Expose()
  phone!: string;

  @ApiProperty({ description: 'Customer email address', required: false })
  @Expose()
  email?: string;

  @ApiProperty({ description: 'Customer status (active/inactive)' })
  @Expose()
  status!: boolean;

  @ApiProperty({
    description: 'Vehicle IDs associated with customer',
    type: [Number],
    required: false,
  })
  @Expose()
  vehicleIds?: number[];

  @ApiProperty({ description: 'Creation timestamp' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Expose()
  updatedAt!: Date;

  constructor(customer: Customer) {
    this.id = customer.id?.value || 0;
    this.name = customer.name.value;
    this.personType = customer.personType.value;
    this.document = customer.document.value;
    this.phone = customer.phone.value;
    this.email = customer.email?.value;
    this.status = customer.status.value;
    this.vehicleIds = customer.vehicleIds;
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;
  }
}
