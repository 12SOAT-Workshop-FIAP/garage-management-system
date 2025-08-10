import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/work-order.repository';
import { AddPartToWorkOrderDto } from '../dtos/add-part-to-work-order.dto';
import { WorkOrderPart } from '../../domain/work-order-part.value-object';
import { Part } from '../../../parts/domain/part.entity';
import { PartRepository } from '../../../parts/domain/part.repository';

/**
 * AddPartToWorkOrderService
 * Service para adicionar peça a uma ordem de serviço
 */
@Injectable()
export class AddPartToWorkOrderService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepository,
    private readonly partRepository: PartRepository,
  ) {}

  async execute(workOrderId: string, dto: AddPartToWorkOrderDto): Promise<void> {
    // Buscar a ordem de serviço
    const workOrder = await this.workOrderRepository.findById(workOrderId);
    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${workOrderId} not found`);
    }

    // Buscar informações da peça
    const part = await this.partRepository.findById(dto.partId);
    if (!part) {
      throw new NotFoundException(`Part with ID ${dto.partId} not found`);
    }

    // Verificar se há estoque suficiente
    if (part.stockQuantity < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock for part ${part.name}. Available: ${part.stockQuantity}, Required: ${dto.quantity}`
      );
    }

    // Verificar se a peça está ativa
    if (!part.active) {
      throw new BadRequestException(`Part ${part.name} is not active`);
    }

    // Usar preço da peça ou preço personalizado
    const unitPrice = dto.unitPrice ?? part.price;

    // Criar value object da peça
    const workOrderPart = new WorkOrderPart(
      part.id,
      part.name,
      part.description,
      part.partNumber,
      dto.quantity,
      unitPrice,
      dto.notes,
    );

    // Adicionar peça à ordem de serviço
    workOrder.addPart(workOrderPart);

    // Salvar ordem de serviço
    await this.workOrderRepository.save(workOrder);
  }
}
