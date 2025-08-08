import { ApiProperty } from '@nestjs/swagger';
import { IsString, Validate } from 'class-validator';
import { DocumentValidator } from '../../../../shared/validators/document.validator';

/**
 * FindCustomerByDocumentDto
 * Data Transfer Object for finding a customer by CPF/CNPJ document.
 */
export class FindCustomerByDocumentDto {
  @ApiProperty({ 
    description: 'CPF (11 digits) or CNPJ (14 digits). Can include formatting like 123.456.789-00 or 12.345.678/0001-90',
    example: '123.456.789-00'
  })
  @IsString()
  document!: string;

  /**
   * Clean the document by removing all non-numeric characters
   */
  getCleanDocument(): string {
    return this.document.replace(/[^\d]/g, '');
  }

  /**
   * Determine person type based on document length
   */
  getPersonType(): 'INDIVIDUAL' | 'COMPANY' {
    const cleanDoc = this.getCleanDocument();
    return cleanDoc.length === 11 ? 'INDIVIDUAL' : 'COMPANY';
  }
}
