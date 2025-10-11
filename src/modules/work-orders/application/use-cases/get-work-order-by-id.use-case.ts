import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { WorkOrderId } from '../../domain/value-objects';
import { GetWorkOrderByIdQuery } from '../queries/get-work-order-by-id.query';

@Injectable()
export class GetWorkOrderByIdUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(query: GetWorkOrderByIdQuery): Promise<WorkOrder> {
    const workOrderId = WorkOrderId.create(query.id);
    const workOrder = await this.workOrderRepository.findById(workOrderId);

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${query.id} not found`);
    }

    return workOrder;
  }
}
