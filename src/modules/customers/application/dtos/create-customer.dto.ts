import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * CreateCustomerDto (DTO de criação de Cliente)
 * Data Transfer Object for creating a customer (Cliente).
 */
export class CreateCustomerDto {
  @ApiProperty({ description: "Customer's name" })
  @IsString()
  @Length(2, 100)
  name!: string;
}
