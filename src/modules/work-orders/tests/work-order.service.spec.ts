import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { WorkOrderRepository } from '../domain/work-order.repository';

describe('CreateWorkOrderService', () => {
  it('should be defined', () => {
    const mockRepository: WorkOrderRepository = { findById: jest.fn(), save: jest.fn() };
    expect(new CreateWorkOrderService(mockRepository)).toBeDefined();
  });
});
