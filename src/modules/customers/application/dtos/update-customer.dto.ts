import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsEmail, IsOptional, Matches } from 'class-validator';

/**
 * UpdateCustomerDto (DTO de atualização de Cliente)
 * Data Transfer Object for updating a customer (Cliente).
 */
export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: "Customer's full name", example: 'João da Silva' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({
    description: "Customer's document (CPF or CNPJ)",
    example: '123.456.789-00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, {
    message: 'document must be a valid CPF or CNPJ format',
  })
  document?: string;

  @ApiPropertyOptional({ description: "Customer's phone number", example: '+55 11 91234-5678' })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  phone?: string;

  @ApiPropertyOptional({ description: "Customer's email address", example: 'joao@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
