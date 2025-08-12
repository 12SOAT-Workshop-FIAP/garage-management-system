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
      // Validate that vehicle exists and get customer through vehicle relationship
      if (!dto.vehicleId) {
        throw new BadRequestException('Vehicle ID is required');
      }

      // Convert vehicleId to string for repository search
      const vehicleIdStr = dto.vehicleId.toString();
      
      // Buscar cliente através do veículo
      const customerId = await this.workOrderRepository.findCustomerByVehicleId(vehicleIdStr);
      if (!customerId) {
        throw new NotFoundException('Cliente não encontrado para o veículo fornecido');
      }

      // Validar se pelo menos um serviço ou peça foi incluído
      if ((!dto.serviceIds || dto.serviceIds.length === 0) && 
          (!dto.partIds || dto.partIds.length === 0)) {
        throw new BadRequestException('Pelo menos um serviço ou peça deve ser incluído na ordem de serviço');
      }

      // Create new work order
      const workOrder = new WorkOrder({
        customerId: customerId,
        vehicleId: vehicleIdStr,
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
