import { WorkOrderStatus } from '../../domain/work-order-status.enum';

export class UpdateWorkOrderCommand {
  constructor(
    public readonly id: string,
    public readonly description?: string,
    public readonly status?: WorkOrderStatus,
    public readonly diagnosis?: string,
    public readonly technicianNotes?: string,
    public readonly estimatedCompletionDate?: Date,
  ) {}
}
