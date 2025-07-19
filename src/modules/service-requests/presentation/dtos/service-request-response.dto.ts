import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ServiceRequestResponseDto {
  @ApiProperty({ description: 'Service request unique identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: "Customer's ID" })
  @Expose()
  customerId!: string;

  @ApiProperty({ description: "Vehicle's ID" })
  @Expose()
  vehicleId!: string;

  @ApiProperty({ description: 'Description of the problem or requested service' })
  @Expose()
  description!: string;

  @ApiProperty({
    description: 'Status of the service request',
    enum: ['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'],
  })
  @Expose()
  status!: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';

  @ApiProperty({ description: 'Creation timestamp' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Expose()
  updatedAt!: Date;
}
