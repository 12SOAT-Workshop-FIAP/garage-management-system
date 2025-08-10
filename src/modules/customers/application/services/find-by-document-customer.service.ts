import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerRepository } from '@modules/customers/domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

@Injectable()
export class FindByDocumentCustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(document: string): Promise<Customer> {
    const cleanDocument = document.replace(/[^\d]/g, '');

    let documentType: 'cpf' | 'cnpj';

    if (cleanDocument.length === 11) {
      documentType = 'cpf';
    } else if (cleanDocument.length === 14) {
      documentType = 'cnpj';
    } else {
      throw new BadRequestException('O documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos.');
    }

    if (!this.cryptographyService.validateSensitiveData(cleanDocument, documentType)) {
      throw new BadRequestException('Formato ou checksum do documento inválido.');
    }

    const documentVo = await this.cryptographyService.encryptSensitiveData(
      cleanDocument,
      documentType,
    );
    const encryptedDocument = documentVo.encryptedValue;

    const customer = await this.customerRepository.findByDocument(encryptedDocument);
    if (!customer) {
      throw new NotFoundException(
        `Customer not found with document: ${documentVo.getMaskedValue()}`,
      );
    }
    customer.document = document;

    return customer;
  }
}
