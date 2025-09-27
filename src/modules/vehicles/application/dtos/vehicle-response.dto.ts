import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '@modules/customers/domain/entities/customer.entity';

export class VehicleResponseDto {
  @ApiProperty({
    description: "Vehicle's unique identifier",
    example: '1',
  })
  id!: string;

  @ApiProperty({
    description: "Vehicle's brand",
    example: 'Toyota',
  })
  brand!: string;

  @ApiProperty({
    description: "Vehicle's model",
    example: 'Corolla',
  })
  model!: string;

  @ApiProperty({
    description: "Vehicle's license plate (formatted)",
    example: 'ABC-1234',
  })
  plate!: string;

  @ApiProperty({
    description: "Vehicle's year",
    example: 2020,
  })
  year!: number;

  @ApiProperty({
    description: 'Customer information',
    type: Customer,
  })
  customer!: Customer;

  @ApiProperty({
    description: 'Date when the vehicle was registered',
    example: '2024-01-15T10:30:00Z',
  })
  created_at!: Date;
}
