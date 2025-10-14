import { WorkOrderStatus } from '../../domain/work-order-status.enum';

export class UpdateWorkOrderCommand {
  constructor(
    public readonly id: string,
    public readonly description?: string,
    public readonly status?: WorkOrderStatus,
    public readonly diagnosis?: string,
    public readonly technicianNotes?: string,
    public readonly estimatedCost?: number,
    public readonly laborCost?: number,
    public readonly partsCost?: number,
    public readonly customerApproval?: boolean,
    public readonly estimatedCompletionDate?: Date,
  ) {}
}
