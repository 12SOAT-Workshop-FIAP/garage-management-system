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

  @ApiProperty({ description: 'Customer creation date', type: String, format: 'date-time' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Customer last update date', type: String, format: 'date-time' })
  @Expose()
  updatedAt!: Date;
}
