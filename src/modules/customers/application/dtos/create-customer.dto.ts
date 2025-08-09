import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsPhoneNumber,
  IsEmail,
  IsBoolean,
  Validate,
  IsEnum,
} from 'class-validator';
import { DocumentValidator } from '../../../../shared/validators/document.validator';

/**
 * CreateCustomerDto
 * Data Transfer Object for creating a customer (Cliente da oficina).
 */
export class CreateCustomerDto {
  @ApiProperty({ description: "Customer's name", minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  name!: string;

  @ApiProperty({ 
    enum: ['INDIVIDUAL', 'COMPANY'], 
    description: 'Type of person - INDIVIDUAL for CPF, COMPANY for CNPJ',
    example: 'INDIVIDUAL'
  })
  @IsEnum(['INDIVIDUAL', 'COMPANY'])
  personType!: 'INDIVIDUAL' | 'COMPANY';

  @ApiProperty({ 
    description: 'CPF (11 digits for INDIVIDUAL) or CNPJ (14 digits for COMPANY). Can include formatting.',
    example: '123.456.789-00'
  })
  @IsString()
  @Validate(DocumentValidator)
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
