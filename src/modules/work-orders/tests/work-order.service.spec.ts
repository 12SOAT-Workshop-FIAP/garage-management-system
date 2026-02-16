import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { MessagingService } from '@shared/messaging/messaging.service';

describe('CreateWorkOrderService', () => {
  it('should be defined', () => {
    const mockRepository: WorkOrderRepository = { 
      findById: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findByCustomerId: jest.fn(),
      findByVehicleId: jest.fn(),
      findByStatus: jest.fn(),
      findByDateRange: jest.fn(),
      delete: jest.fn(),
      findCustomerByVehicleId: jest.fn(),
      findCustomerByLicensePlate: jest.fn()
    };
    const mockMessaging = { publish: jest.fn(), subscribe: jest.fn() } as unknown as MessagingService;
    expect(new CreateWorkOrderService(mockRepository, mockMessaging)).toBeDefined();
  });
});
