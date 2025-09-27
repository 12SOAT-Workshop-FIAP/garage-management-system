import { Injectable } from '@nestjs/common';
import { SendEmailNotificationService } from './send-email-notification.service';
import { WorkOrderStatus } from '@modules/work-orders/domain/work-order-status.enum';

export interface WorkOrderEmailData {
  workOrderId: string;
  customerName: string;
  customerEmail: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  status: WorkOrderStatus;
  updatedAt: Date;
  estimatedCompletion?: Date;
  totalValue?: number;
  statusMessage?: string;
}

/**
 * WorkOrderEmailNotificationService
 * Specialized service for sending work order status change notifications.
 */
@Injectable()
export class WorkOrderEmailNotificationService {
  constructor(private readonly sendEmailNotificationService: SendEmailNotificationService) {}

  async sendStatusChangeNotification(data: WorkOrderEmailData): Promise<void> {
    try {
      const subject = `Atualização da Ordem de Serviço #${data.workOrderId}`;

      const templateData = {
        customerName: data.customerName,
        workOrderId: data.workOrderId,
        status: data.status,
        statusDisplay: this.getStatusDisplayName(data.status),
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        vehiclePlate: data.vehiclePlate,
        updatedAt: data.updatedAt.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        estimatedCompletion: data.estimatedCompletion?.toLocaleDateString('pt-BR'),
        totalValue: data.totalValue?.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        statusMessage: data.statusMessage || this.getDefaultStatusMessage(data.status),
      };

      await this.sendEmailNotificationService.execute({
        recipients: [
          {
            email: data.customerEmail,
            name: data.customerName,
          },
        ],
        subject,
        templateName: 'service-order-status-notification',
        templateData,
      });

      console.log(`Work order status notification sent for order #${data.workOrderId}`);
    } catch (error) {
      console.error(
        `Failed to send work order notification for order #${data.workOrderId}:`,
        error,
      );
      throw error;
    }
  }

  private getStatusDisplayName(status: WorkOrderStatus): string {
    const statusMap: Record<WorkOrderStatus, string> = {
      [WorkOrderStatus.RECEIVED]: 'Recebida',
      [WorkOrderStatus.DIAGNOSIS]: 'Diagnóstico',
      [WorkOrderStatus.PENDING]: 'Pendente',
      [WorkOrderStatus.APPROVED]: 'Aprovada',
      [WorkOrderStatus.IN_PROGRESS]: 'Em Andamento',
      [WorkOrderStatus.WAITING_PARTS]: 'Aguardando Peças',
      [WorkOrderStatus.COMPLETED]: 'Concluída',
      [WorkOrderStatus.CANCELLED]: 'Cancelada',
      [WorkOrderStatus.DELIVERED]: 'Entregue',
    };
    return statusMap[status] || status;
  }

  private getDefaultStatusMessage(status: WorkOrderStatus): string {
    const messageMap: Record<WorkOrderStatus, string> = {
      [WorkOrderStatus.RECEIVED]: 'Sua ordem de serviço foi recebida e está em análise.',
      [WorkOrderStatus.DIAGNOSIS]: 'Sua ordem de serviço está em processo de diagnóstico.',
      [WorkOrderStatus.PENDING]: 'Sua ordem de serviço foi criada e está aguardando aprovação.',
      [WorkOrderStatus.APPROVED]: 'Sua ordem de serviço foi aprovada e será iniciada em breve.',
      [WorkOrderStatus.IN_PROGRESS]: 'Os trabalhos em seu veículo foram iniciados.',
      [WorkOrderStatus.WAITING_PARTS]:
        'Estamos aguardando a chegada de peças para continuar o serviço.',
      [WorkOrderStatus.COMPLETED]:
        'O serviço foi concluído. Seu veículo está pronto para retirada.',
      [WorkOrderStatus.CANCELLED]: 'A ordem de serviço foi cancelada.',
      [WorkOrderStatus.DELIVERED]: 'Veículo entregue com sucesso. Obrigado pela confiança!',
    };
    return messageMap[status] || '';
  }
}
