import { CreateWorkOrderService } from '../application/services/create-work-order.service';
import { WorkOrderRepository } from '../domain/work-order.repository';

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
    expect(new CreateWorkOrderService(mockRepository)).toBeDefined();
  });
});
