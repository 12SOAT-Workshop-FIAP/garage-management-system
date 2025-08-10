import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer.repository';
import { Customer } from '@modules/customers/domain/customer';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CryptographyService } from '@modules/cryptography/application/services/cryptography.service';

/**
 * UpdateCustomerService (Serviço de atualização de Cliente)
 * Application service for updating a customer (Cliente).
 */
@Injectable()
export class UpdateCustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async execute(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const oldCustomer = await this.customerRepository.findById(id);
    if (!oldCustomer || !oldCustomer.status) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    let updatedDto = { ...updateCustomerDto };

    if (updateCustomerDto.document) {
      const personType = updateCustomerDto.personType || oldCustomer.personType;
      const documentType = personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';

      const documentVo = await this.cryptographyService.encryptSensitiveData(
        updateCustomerDto.document,
        documentType,
      );

      updatedDto.document = documentVo.encryptedValue;
    }

    const updated = await this.customerRepository.update(oldCustomer, updatedDto);
    if (!updated) throw new NotFoundException(`Customer with ID ${id} not found`);

    if (updated.document) {
      const documentType = updated.personType === 'INDIVIDUAL' ? 'cpf' : 'cnpj';
      const documentVo = await this.cryptographyService.decryptSensitiveData(
        updated.document,
        documentType,
      );
      updated.document = documentVo.value;
    }

    return updated;
  }
}
