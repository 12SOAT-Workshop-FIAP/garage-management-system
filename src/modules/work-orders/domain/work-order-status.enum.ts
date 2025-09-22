/**
 * WorkOrderStatus Enum
 * Represents the possible statuses of a work order.
 */
export enum WorkOrderStatus {
  RECEIVED = 'received',
  DIAGNOSIS = 'diagnosis',
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
