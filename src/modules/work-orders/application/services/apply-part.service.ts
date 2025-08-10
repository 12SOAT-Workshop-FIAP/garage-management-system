import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';

/**
 * ApplyPartService
 * Service para aplicar peça em uma ordem de serviço (marcar como usada)
 */
@Injectable()
export class ApplyPartService {
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
    const part = workOrder.parts.find(p => p.partId === partId);
    if (!part) {
      throw new NotFoundException(`Part with ID ${partId} not found in work order`);
    }

    // Verificar se a peça está aprovada
    if (!part.isApproved) {
      throw new BadRequestException('Part must be approved before it can be applied');
    }

    // Aplicar peça
    workOrder.applyPart(partId);

    // Salvar ordem de serviço
    await this.workOrderRepository.save(workOrder);
  }
}
