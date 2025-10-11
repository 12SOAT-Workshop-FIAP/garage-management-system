import { Injectable } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { GetWorkOrdersByStatusQuery } from '../queries/get-work-orders-by-status.query';

@Injectable()
export class GetWorkOrdersByStatusUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(query: GetWorkOrdersByStatusQuery): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByStatus(query.status);
  }
}
