import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateWorkOrderDto } from '../../application/dtos/create-work-order.dto';
import { UpdateWorkOrderDto } from '../../application/dtos/update-work-order.dto';
import { WorkOrderResponseDto } from '../dtos/work-order-response.dto';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';
import { CreateWorkOrderService } from '../../application/services/create-work-order.service';
import { UpdateWorkOrderService } from '../../application/services/update-work-order.service';
import { FindWorkOrderService } from '../../application/services/find-work-order.service';

@ApiTags('work-orders')
@Controller('work-orders')
export class WorkOrderController {
  constructor(
    private readonly createWorkOrderService: CreateWorkOrderService,
    private readonly updateWorkOrderService: UpdateWorkOrderService,
    private readonly findWorkOrderService: FindWorkOrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Work order created successfully', type: WorkOrderResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() dto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
    const workOrder = await this.createWorkOrderService.execute(dto);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work orders retrieved successfully', type: [WorkOrderResponseDto] })
  @ApiQuery({ name: 'status', enum: WorkOrderStatus, required: false })
  @ApiQuery({ name: 'customerId', type: 'string', required: false })
  @ApiQuery({ name: 'vehicleId', type: 'string', required: false })
  async findAll(
    @Query('status') status?: WorkOrderStatus,
    @Query('customerId') customerId?: string,
    @Query('vehicleId') vehicleId?: string,
  ): Promise<WorkOrderResponseDto[]> {
    let workOrders;

    if (status) {
      workOrders = await this.findWorkOrderService.findByStatus(status);
    } else if (customerId) {
      workOrders = await this.findWorkOrderService.findByCustomerId(customerId);
    } else if (vehicleId) {
      workOrders = await this.findWorkOrderService.findByVehicleId(vehicleId);
    } else {
      workOrders = await this.findWorkOrderService.findAll();
    }

    return workOrders.map(workOrder => WorkOrderResponseDto.fromDomain(workOrder));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order retrieved successfully', type: WorkOrderResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.findWorkOrderService.findById(id);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order updated successfully', type: WorkOrderResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWorkOrderDto): Promise<WorkOrderResponseDto> {
    const workOrder = await this.updateWorkOrderService.execute(id, dto);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Work order deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    // Note: In a real implementation, you might want to create a delete service
    // For now, we'll throw an error since deletion might not be allowed for work orders
    throw new Error('Work order deletion not implemented - consider status change instead');
  }
}
