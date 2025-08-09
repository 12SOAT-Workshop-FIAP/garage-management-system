import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';
import { CpfValidator } from '../../../../shared/validators/cpf.validator';
import { CnpjValidator } from '../../../../shared/validators/cnpj.validator';

@Injectable()
export class FindByDocumentCustomerService {
  private cpfValidator = new CpfValidator();
  private cnpjValidator = new CnpjValidator();

  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(document: string): Promise<Customer> {
    // Clean document (remove formatting)
    const cleanDocument = document.replace(/[^\d]/g, '');
    
    // Validate document format
    if (!this.isValidDocument(cleanDocument)) {
      throw new BadRequestException('Invalid CPF or CNPJ format or checksum');
    }

    const customer = await this.customerRepository.findByDocument(cleanDocument);
    if (!customer) {
      throw new NotFoundException(`Customer not found with document: ${this.maskDocument(cleanDocument)}`);
    }
    return customer;
  }

  /**
   * Validate if document is a valid CPF or CNPJ
   */
  private isValidDocument(document: string): boolean {
    if (document.length === 11) {
      // Validate CPF
      return this.cpfValidator.validate(document, {} as any);
    } else if (document.length === 14) {
      // Validate CNPJ
      return this.cnpjValidator.validate(document, {} as any);
    }
    return false;
  }

  /**
   * Mask document for security (show only first and last few digits)
   */
  private maskDocument(document: string): string {
    if (document.length === 11) {
      // CPF: 123.***.*89-00
      return `${document.slice(0, 3)}.***.*${document.slice(-4, -2)}-${document.slice(-2)}`;
    } else if (document.length === 14) {
      // CNPJ: 12.***.***/0001-90
      return `${document.slice(0, 2)}.***.***/****-${document.slice(-2)}`;
    }
    return document;
  }
}
