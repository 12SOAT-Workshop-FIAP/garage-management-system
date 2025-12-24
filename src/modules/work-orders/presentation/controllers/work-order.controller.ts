import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateWorkOrderDto } from '../../application/dtos/create-work-order.dto';
import { UpdateWorkOrderDto } from '../../application/dtos/update-work-order.dto';
import { WorkOrderResponseDto } from '../dtos/work-order-response.dto';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { CreateWorkOrderUseCase } from '../../application/use-cases/create-work-order.use-case';
import { UpdateWorkOrderUseCase } from '../../application/use-cases/update-work-order.use-case';
import { GetWorkOrderByIdUseCase } from '../../application/use-cases/get-work-order-by-id.use-case';
import { GetAllWorkOrdersUseCase } from '../../application/use-cases/get-all-work-orders.use-case';
import { GetWorkOrdersByCustomerUseCase } from '../../application/use-cases/get-work-orders-by-customer.use-case';
import { GetWorkOrdersByStatusUseCase } from '../../application/use-cases/get-work-orders-by-status.use-case';
import { GetWorkOrdersByVehicleUseCase } from '../../application/use-cases/get-work-orders-by-vehicle.use-case';
import { DeleteWorkOrderUseCase } from '../../application/use-cases/delete-work-order.use-case';
import { CreateWorkOrderCommand } from '../../application/commands/create-work-order.command';
import { UpdateWorkOrderCommand } from '../../application/commands/update-work-order.command';
import { DeleteWorkOrderCommand } from '../../application/commands/delete-work-order.command';
import { GetWorkOrderByIdQuery } from '../../application/queries/get-work-order-by-id.query';
import { GetAllWorkOrdersQuery } from '../../application/queries/get-all-work-orders.query';
import { GetWorkOrdersByCustomerQuery } from '../../application/queries/get-work-orders-by-customer.query';
import { GetWorkOrdersByStatusQuery } from '../../application/queries/get-work-orders-by-status.query';
import { GetWorkOrdersByVehicleQuery } from '../../application/queries/get-work-orders-by-vehicle.query';
import { ApproveWorkOrderCommand } from '@modules/work-orders/application/commands/approve-work-order.command';
import { ApproveWorkOrderUseCase } from '@modules/work-orders/application/use-cases/approve-work-order.use-case';
import { WinstonLoggerService } from '@shared/infrastructure/winston-logger.service';
import { NewRelicService } from '@shared/infrastructure/new-relic.service';

@ApiTags('work-orders')
@Controller('work-orders')
export class WorkOrderController {
  constructor(
    private readonly createWorkOrderUseCase: CreateWorkOrderUseCase,
    private readonly updateWorkOrderUseCase: UpdateWorkOrderUseCase,
    private readonly getWorkOrderByIdUseCase: GetWorkOrderByIdUseCase,
    private readonly getAllWorkOrdersUseCase: GetAllWorkOrdersUseCase,
    private readonly getWorkOrdersByCustomerUseCase: GetWorkOrdersByCustomerUseCase,
    private readonly getWorkOrdersByStatusUseCase: GetWorkOrdersByStatusUseCase,
    private readonly getWorkOrdersByVehicleUseCase: GetWorkOrdersByVehicleUseCase,
    private readonly deleteWorkOrderUseCase: DeleteWorkOrderUseCase,
    private readonly approveWorkOrderUseCase: ApproveWorkOrderUseCase,
    private readonly logger: WinstonLoggerService,
    private readonly newRelic: NewRelicService,
  ) {
    this.logger.setContext('WorkOrderController');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Work order created successfully',
    type: WorkOrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() dto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
    const startTime = Date.now();

    this.logger.log('Creating new work order', undefined, {
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      estimatedCost: dto.estimatedCost,
    });

    this.newRelic.addCustomAttributes({
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      estimatedCost: dto.estimatedCost || 0,
    });

    try {
      const command = new CreateWorkOrderCommand(
        dto.customerId,
        dto.vehicleId,
        dto.description,
        dto.estimatedCost,
        dto.diagnosis,
      );
      const workOrder = await this.createWorkOrderUseCase.execute(command);
      const response = WorkOrderResponseDto.fromDomain(workOrder);

      const duration = Date.now() - startTime;

      this.logger.log('Work order created successfully', undefined, {
        orderId: workOrder.id,
        duration,
      });

      this.newRelic.incrementMetric('Custom/WorkOrders/Created');
      this.newRelic.recordMetric('Custom/WorkOrders/TotalValue', dto.estimatedCost || 0);

      this.newRelic.recordEvent('WorkOrderCreated', {
        orderId: workOrder.id,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        estimatedCost: dto.estimatedCost || 0,
        status: workOrder.status,
        createdAt: new Date().toISOString(),
        processingTimeMs: duration,
      });

      this.logger.logBusinessEvent('work_order_created', {
        orderId: workOrder.id,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        estimatedCost: dto.estimatedCost || 0,
        status: workOrder.status,
      });

      return response;
    } catch (err) {
      const error = err as Error;
      this.logger.error(
        'Failed to create work order',
        error.stack,
        undefined,
        {
          customerId: dto.customerId,
          vehicleId: dto.vehicleId,
          error: error.message,
        },
      );

      this.newRelic.noticeError(error, {
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        estimatedCost: dto.estimatedCost || 0,
      });

      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work orders retrieved successfully',
    type: [WorkOrderResponseDto],
  })
  @ApiQuery({ name: 'status', enum: WorkOrderStatus, required: false })
  @ApiQuery({ name: 'customerId', type: 'number', required: false })
  @ApiQuery({ name: 'vehicleId', type: 'number', required: false })
  async findAll(
    @Query('status') status?: WorkOrderStatus,
    @Query('customerId') customerId?: number,
    @Query('vehicleId') vehicleId?: number,
  ): Promise<WorkOrderResponseDto[]> {
    let workOrders;

    if (status) {
      const query = new GetWorkOrdersByStatusQuery(status);
      workOrders = await this.getWorkOrdersByStatusUseCase.execute(query);
    } else if (customerId) {
      const query = new GetWorkOrdersByCustomerQuery(customerId);
      workOrders = await this.getWorkOrdersByCustomerUseCase.execute(query);
    } else if (vehicleId) {
      const query = new GetWorkOrdersByVehicleQuery(vehicleId);
      workOrders = await this.getWorkOrdersByVehicleUseCase.execute(query);
    } else {
      const query = new GetAllWorkOrdersQuery();
      workOrders = await this.getAllWorkOrdersUseCase.execute(query);
    }

    return workOrders.map((workOrder) => WorkOrderResponseDto.fromDomain(workOrder));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work order retrieved successfully',
    type: WorkOrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<WorkOrderResponseDto> {
    const query = new GetWorkOrderByIdQuery(id);
    const workOrder = await this.getWorkOrderByIdUseCase.execute(query);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work order updated successfully',
    type: WorkOrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkOrderDto,
  ): Promise<WorkOrderResponseDto> {
    const command = new UpdateWorkOrderCommand(
      id,
      dto.description,
      dto.status,
      dto.diagnosis,
      dto.technicianNotes,
      dto.estimatedCost,
      dto.laborCost,
      dto.partsCost,
      dto.customerApproval,
      dto.estimatedCompletionDate,
    );
    const workOrder = await this.updateWorkOrderUseCase.execute(command);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order approved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async approve(@Param('id', ParseUUIDPipe) id: string): Promise<WorkOrderResponseDto> {
    const command = new ApproveWorkOrderCommand(id);
    const workOrder = await this.approveWorkOrderUseCase.execute(command);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Work order deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const command = new DeleteWorkOrderCommand(id);
    await this.deleteWorkOrderUseCase.execute(command);
  }
}
