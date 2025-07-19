import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { CreateWorkOrderDto } from '../dtos/create-work-order.dto';

/**
 * CreateWorkOrderService (Serviço de criação de Ordem de Serviço)
 * Application service for creating a work order (Ordem de Serviço).
 */
@Injectable()
export class CreateWorkOrderService {
  constructor(private readonly workOrderRepository: WorkOrderRepository) {}

  async execute(_dto: CreateWorkOrderDto) {
    // TODO: Implement work order creation logic
    return null;
  }
}
