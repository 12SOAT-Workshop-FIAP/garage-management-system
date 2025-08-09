import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { CreateWorkOrderDto } from '../dtos/create-work-order.dto';
import { WorkOrder } from '../../domain/work-order.entity';

/**
 * CreateWorkOrderService (Serviço de criação de Ordem de Serviço)
 * Application service for creating a work order (Ordem de Serviço).
 */
@Injectable()
export class CreateWorkOrderService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
  ) {}

  async execute(dto: CreateWorkOrderDto): Promise<WorkOrder> {
    try {
      // Validate that customer and vehicle exist (this would be done via repositories in a full implementation)
      if (!dto.customerId || !dto.vehicleId) {
        throw new BadRequestException('Customer ID and Vehicle ID are required');
      }

      // Create new work order
      const workOrder = new WorkOrder({
        customerId: dto.customerId,
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

      return savedWorkOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create work order');
    }
  }
}
