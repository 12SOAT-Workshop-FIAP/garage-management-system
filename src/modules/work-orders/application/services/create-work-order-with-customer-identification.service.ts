import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { CreateWorkOrderWithCustomerDto } from '../dtos/create-work-order-with-customer-identification.dto';
import { WorkOrder } from '../../domain/work-order.entity';
import { FindCustomerByDocumentUseCase } from '@modules/customers/application/use-cases/find-customer-by-document.use-case';

/**
 * CreateWorkOrderWithCustomerIdentificationService
 * Application service for creating a work order with automatic customer identification by CPF/CNPJ.
 */
@Injectable()
export class CreateWorkOrderWithCustomerIdentificationService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly findByDocumentCustomerService: FindCustomerByDocumentUseCase,
  ) {}

  async execute(
    dto: CreateWorkOrderWithCustomerDto,
  ): Promise<{ workOrder: WorkOrder; customer: any }> {
    let customer: any;

    // Determine customer
    if (dto.customerId) {
      // If customerId is provided, we'll assume it's valid for now
      // In a complete implementation, you'd validate the customer exists
      customer = { id: dto.customerId };
    } else if (dto.customerDocument) {
      // Find customer by CPF/CNPJ
      const query = { document: dto.customerDocument } as any;
      customer = await this.findByDocumentCustomerService.execute(query);
    } else {
      throw new BadRequestException('Either customerId or customerDocument must be provided');
    }

    try {
      // Create new work order with the complete structure
      const workOrder = new WorkOrder({
        customerId: customer.id.toString(),
        vehicleId: dto.vehicleId,
        description: dto.description,
        estimatedCost: dto.estimatedCost,
        diagnosis: dto.diagnosis,
      });

      if (dto.estimatedCompletionDate) {
        workOrder.estimatedCompletionDate = dto.estimatedCompletionDate;
      }

      // Save work order
      const savedWorkOrder = await this.workOrderRepository.save(workOrder);

      return {
        workOrder: savedWorkOrder,
        customer: customer,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create work order');
    }
  }
}
