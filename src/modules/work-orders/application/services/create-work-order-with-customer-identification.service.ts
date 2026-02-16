import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { CreateWorkOrderWithCustomerDto } from '../dtos/create-work-order-with-customer-identification.dto';
import { WorkOrder } from '../../domain/work-order.entity';
import { FindCustomerByDocumentUseCase } from '@modules/customers/application/use-cases/find-customer-by-document.use-case';
import { MessagingService } from '@shared/messaging/messaging.service';

/**
 * CreateWorkOrderWithCustomerIdentificationService
 * Application service for creating a work order with automatic customer identification by CPF/CNPJ.
 */
@Injectable()
export class CreateWorkOrderWithCustomerIdentificationService {
  private readonly logger = new Logger(CreateWorkOrderWithCustomerIdentificationService.name);

  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly findByDocumentCustomerService: FindCustomerByDocumentUseCase,
    private readonly messagingService: MessagingService,
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

      // Publicar evento para iniciar saga
      await this.messagingService.publish('work-order.created', {
        workOrderId: savedWorkOrder.id,
        customerId: savedWorkOrder.customerId,
        vehicleId: savedWorkOrder.vehicleId,
      });
      this.logger.log(`Published work-order.created for WO ${savedWorkOrder.id}`);

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
