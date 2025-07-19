import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * CustomerResponseDto (DTO de resposta de Cliente)
 * Data Transfer Object for customer response (Cliente).
 */
export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer unique identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: "Customer's name" })
  @Expose()
  name!: string;
}
