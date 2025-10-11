import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { CreateWorkOrderCommand } from '../commands/create-work-order.command';

@Injectable()
export class CreateWorkOrderUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(command: CreateWorkOrderCommand): Promise<WorkOrder> {
    // Get customer ID from vehicle ID
    const customerId = await this.workOrderRepository.findCustomerByVehicleId(command.vehicleId);
    if (!customerId) {
      throw new NotFoundException('Customer not found for provided vehicle');
    }

    const workOrder = WorkOrder.create({
      customerId: customerId,
      vehicleId: command.vehicleId,
      description: command.description,
      estimatedCost: command.estimatedCost,
      diagnosis: command.diagnosis,
    });

    return await this.workOrderRepository.save(workOrder);
  }
}
