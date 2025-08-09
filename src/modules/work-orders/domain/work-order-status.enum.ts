/**
 * WorkOrderStatus Enum
 * Represents the possible statuses of a work order.
 */
export enum WorkOrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  WAITING_CUSTOMER = 'waiting_customer',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
}
