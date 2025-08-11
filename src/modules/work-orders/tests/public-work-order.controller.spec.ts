import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PublicWorkOrderController } from '../presentation/controllers/public-work-order.controller';
import { FindWorkOrderService } from '../application/services/find-work-order.service';
import { FindByDocumentCustomerService } from '@modules/customers/application/services/find-by-document-customer.service';
import { WorkOrderStatus } from '../domain/work-order-status.enum';

describe('PublicWorkOrderController', () => {
  let controller: PublicWorkOrderController;
  let findWorkOrderService: { findById: jest.Mock };
  let findByDocumentCustomerService: { execute: jest.Mock };

  const workOrderId = '11111111-1111-1111-1111-111111111111';
  const customerId = '22222222-2222-2222-2222-222222222222';

  const mockWorkOrder = {
    id: workOrderId,
    customerId,
    status: WorkOrderStatus.PENDING,
    description: 'Troca de óleo',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    estimatedCompletionDate: new Date('2024-01-02T00:00:00.000Z'),
  } as any;

  beforeEach(async () => {
    findWorkOrderService = {
      findById: jest.fn(),
    };
    findByDocumentCustomerService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicWorkOrderController],
      providers: [
        { provide: FindWorkOrderService, useValue: findWorkOrderService },
        { provide: FindByDocumentCustomerService, useValue: findByDocumentCustomerService },
      ],
    }).compile();

    controller = module.get<PublicWorkOrderController>(PublicWorkOrderController);
  });

  it('should return public status when document matches work order customer', async () => {
    findWorkOrderService.findById.mockResolvedValue(mockWorkOrder);
    // Return customer with id matching workOrder.customerId
    findByDocumentCustomerService.execute.mockResolvedValue({ id: customerId });

    const result = await controller.getStatus(workOrderId, '123.456.789-09');

    expect(findWorkOrderService.findById).toHaveBeenCalledWith(workOrderId);
    expect(findByDocumentCustomerService.execute).toHaveBeenCalledWith('123.456.789-09');
    expect(result).toMatchObject({
      id: workOrderId,
      status: WorkOrderStatus.PENDING,
      description: 'Troca de óleo',
    });
  });

  it('should throw BadRequestException when document is missing', async () => {
    await expect(controller.getStatus(workOrderId, undefined as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException when work order is not found', async () => {
    findWorkOrderService.findById.mockRejectedValue(new NotFoundException('Work order not found'));

    await expect(controller.getStatus(workOrderId, '12345678909')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when document does not match work order customer', async () => {
    findWorkOrderService.findById.mockResolvedValue(mockWorkOrder);
    // Customer id does not match workOrder.customerId
    findByDocumentCustomerService.execute.mockResolvedValue({ id: 'different-id' });

    await expect(controller.getStatus(workOrderId, '12345678909')).rejects.toThrow(
      NotFoundException,
    );
  });
});
