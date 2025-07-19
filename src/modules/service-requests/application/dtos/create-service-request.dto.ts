import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID } from 'class-validator';

export class CreateServiceRequestDto {
  @ApiProperty({ description: "Customer's ID" })
  @IsUUID()
  customerId!: string;

  @ApiProperty({ description: "Vehicle's ID" })
  @IsUUID()
  vehicleId!: string;

  @ApiProperty({
    description: 'Description of the problem or requested service',
    example: 'Engine making noise',
  })
  @IsString()
  @Length(5, 500)
  description!: string;
}
