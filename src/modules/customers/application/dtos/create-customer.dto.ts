import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  Matches,
  IsPhoneNumber,
  IsEmail,
  IsBoolean,
  IsEnum,
} from 'class-validator';

/**
 * CreateCustomerDto
 * Data Transfer Object for creating a customer (Cliente da oficina).
 */
export class CreateCustomerDto {
  @ApiProperty({ description: "Customer's name", minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  name!: string;

  @ApiProperty({ enum: ['INDIVIDUAL', 'COMPANY'], description: 'Type of person' })
  @IsEnum(['INDIVIDUAL', 'COMPANY'])
  personType!: 'INDIVIDUAL' | 'COMPANY';

  @ApiProperty({ description: 'CPF (11 digits) or CNPJ (14 digits)' })
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'document must be a valid CPF (11 digits) or CNPJ (14 digits)',
  })
  document!: string;

  @ApiProperty({ description: 'Customer phone number in E.164 format (e.g. +5511999999999)' })
  @IsPhoneNumber('BR')
  phone!: string;

  @ApiProperty({ description: 'Customer email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Indicates if the customer is active',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean = true;
}
