import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsNumber, Length, Min, ValidateIf, Validate } from 'class-validator';
import { DocumentValidator } from '../../../../shared/validators/document.validator';

/**
 * CreateWorkOrderWithCustomerDto (DTO de criação de Ordem de Serviço)
 * Data Transfer Object for creating a work order (Ordem de Serviço).
 * Allows identification of customer by ID or by CPF/CNPJ document.
 */
export class CreateWorkOrderWithCustomerDto {
  @ApiProperty({ 
    description: 'Customer ID (UUID)', 
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf(o => !o.customerDocument)
  customerId?: string;

  @ApiProperty({ 
    description: 'Customer CPF or CNPJ document (alternative to customerId)', 
    required: false,
    example: '123.456.789-00'
  })
  @IsOptional()
  @IsString()
  @ValidateIf(o => !o.customerId)
  customerDocument?: string;

  @ApiProperty({ description: 'Vehicle ID' })
  @IsUUID()
  vehicleId!: string;

  @ApiProperty({ description: 'Work order description' })
  @IsString()
  @Length(10, 1000)
  description!: string;

  @ApiProperty({ description: 'Initial diagnosis', required: false })
  @IsOptional()
  @IsString()
  @Length(10, 2000)
  diagnosis?: string;

  @ApiProperty({ description: 'Estimated cost', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCost?: number;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsOptional()
  estimatedCompletionDate?: Date;

  /**
   * Clean customer document by removing formatting
   */
  getCleanCustomerDocument(): string | undefined {
    return this.customerDocument?.replace(/[^\d]/g, '');
  }
}
