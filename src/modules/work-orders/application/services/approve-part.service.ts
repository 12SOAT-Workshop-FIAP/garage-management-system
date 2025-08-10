import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';

/**
 * ApprovePartService
 * Service para aprovar peça em uma ordem de serviço
 */
@Injectable()
export class ApprovePartService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
  ) {}

  async execute(workOrderId: string, partId: string): Promise<void> {
    // Buscar a ordem de serviço
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${workOrderId} not found`);
    }

    // Verificar se a peça existe na ordem de serviço
    const partExists = workOrder.parts.some(part => part.partId === partId);
    if (!partExists) {
      throw new NotFoundException(`Part with ID ${partId} not found in work order`);
    }

    // Aprovar peça
    workOrder.approvePart(partId);

    // Salvar ordem de serviço
    await this.workOrderRepository.save(workOrder);
  }
}
