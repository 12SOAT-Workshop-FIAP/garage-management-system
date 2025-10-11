import { Injectable } from '@nestjs/common';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { GetWorkOrdersByVehicleQuery } from '../queries/get-work-orders-by-vehicle.query';

@Injectable()
export class GetWorkOrdersByVehicleUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(query: GetWorkOrdersByVehicleQuery): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findByVehicleId(query.vehicleId);
  }
}
