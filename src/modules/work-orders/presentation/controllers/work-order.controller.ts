import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseUUIDPipe, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateWorkOrderDto } from '../../application/dtos/create-work-order.dto';
import { CreateWorkOrderWithCustomerDto } from '../../application/dtos/create-work-order-with-customer-identification.dto';
import { UpdateWorkOrderDto } from '../../application/dtos/update-work-order.dto';
import { 
  CreateWorkOrderWithServicesDto, 
  AddServiceToWorkOrderDto, 
  UpdateWorkOrderServiceDto, 
  CompleteServiceDto 
} from '../../application/dtos/work-order-services.dto';
import { WorkOrderResponseDto } from '../dtos/work-order-response.dto';
import { 
  WorkOrderDetailedResponseDto, 
  WorkOrderCostBreakdownResponseDto 
} from '../dtos/work-order-detailed-response.dto';
import { CreateWorkOrderService } from '../../application/services/create-work-order.service';
import { CreateWorkOrderWithCustomerIdentificationService } from '../../application/services/create-work-order-with-customer-identification.service';
import { UpdateWorkOrderService } from '../../application/services/update-work-order.service';
import { FindWorkOrderService } from '../../application/services/find-work-order.service';
import { CreateWorkOrderWithServicesService } from '../../application/services/create-work-order-with-services.service';
import { AddServiceToWorkOrderService } from '../../application/services/add-service-to-work-order.service';
import { ManageWorkOrderServicesService } from '../../application/services/manage-work-order-services.service';
import { WorkOrderStatus } from '../../domain/work-order-status.enum';

@ApiTags('work-orders')
@Controller('work-orders')
export class WorkOrderController {
  constructor(
    private readonly createWorkOrderService: CreateWorkOrderService,
    private readonly createWorkOrderWithCustomerIdentificationService: CreateWorkOrderWithCustomerIdentificationService,
    private readonly updateWorkOrderService: UpdateWorkOrderService,
    private readonly findWorkOrderService: FindWorkOrderService,
    private readonly createWorkOrderWithServicesService: CreateWorkOrderWithServicesService,
    private readonly addServiceToWorkOrderService: AddServiceToWorkOrderService,
    private readonly manageWorkOrderServicesService: ManageWorkOrderServicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Work order created successfully', type: WorkOrderResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() dto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
    const workOrder = await this.createWorkOrderService.execute(dto);
    return WorkOrderResponseDto.fromDomain(workOrder);
  }

  @Post('with-customer-identification')
  @ApiOperation({ 
    summary: 'Create a new work order with customer identification by CPF/CNPJ',
    description: 'Allows creating work orders by providing customer CPF/CNPJ instead of customer ID'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Work order created successfully with customer identification', 
    type: WorkOrderResponseDto 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data or document format' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found with provided document' })
  async createWithCustomerIdentification(@Body() dto: CreateWorkOrderWithCustomerDto): Promise<WorkOrderResponseDto> {
    const result = await this.createWorkOrderWithCustomerIdentificationService.execute(dto);
    return WorkOrderResponseDto.fromDomain(result.workOrder);
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

  @Get('pending')
  @ApiOperation({ summary: 'Get work orders pending approval' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pending work orders retrieved successfully', type: [WorkOrderResponseDto] })
  async findPending(): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.findWorkOrderService.findPendingApproval();
    return workOrders.map(workOrder => WorkOrderResponseDto.fromDomain(workOrder));
  }

  @Get('in-progress')
  @ApiOperation({ summary: 'Get work orders in progress' })
  @ApiResponse({ status: HttpStatus.OK, description: 'In progress work orders retrieved successfully', type: [WorkOrderResponseDto] })
  async findInProgress(): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.findWorkOrderService.findInProgress();
    return workOrders.map(workOrder => WorkOrderResponseDto.fromDomain(workOrder));
  }

  @Get('completed')
  @ApiOperation({ summary: 'Get completed work orders' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Completed work orders retrieved successfully', type: [WorkOrderResponseDto] })
  async findCompleted(): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.findWorkOrderService.findCompleted();
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

  // ===== NEW SERVICES-RELATED ENDPOINTS =====

  @Post('with-services')
  @ApiOperation({ summary: 'Create work order with services included' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Work order with services created successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createWithServices(@Body() dto: CreateWorkOrderWithServicesDto): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.createWorkOrderWithServicesService.execute(dto);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Get(':id/detailed')
  @ApiOperation({ summary: 'Get work order with all services details' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Work order details retrieved successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async getDetailed(@Param('id', ParseUUIDPipe) id: string): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.findWorkOrderService.findById(id);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Get(':id/cost-breakdown')
  @ApiOperation({ summary: 'Get work order cost breakdown' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cost breakdown retrieved successfully', type: WorkOrderCostBreakdownResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order not found' })
  async getCostBreakdown(@Param('id', ParseUUIDPipe) id: string): Promise<WorkOrderCostBreakdownResponseDto> {
    const workOrder = await this.findWorkOrderService.findById(id);
    return new WorkOrderCostBreakdownResponseDto(workOrder);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Add service to work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Service added successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or service not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data or operation not allowed' })
  async addService(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AddServiceToWorkOrderDto): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.addServiceToWorkOrderService.execute(id, dto);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Put(':id/services/:serviceId')
  @ApiOperation({ summary: 'Update service in work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service updated successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or service not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateService(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('serviceId') serviceId: string,
    @Body() dto: UpdateWorkOrderServiceDto
  ): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.manageWorkOrderServicesService.updateService(id, serviceId, dto);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Delete(':id/services/:serviceId')
  @ApiOperation({ summary: 'Remove service from work order' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service removed successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or service not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Operation not allowed' })
  async removeService(@Param('id', ParseUUIDPipe) id: string, @Param('serviceId') serviceId: string): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.manageWorkOrderServicesService.removeService(id, serviceId);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Post(':id/services/:serviceId/start')
  @ApiOperation({ summary: 'Start service execution' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service started successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or service not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service cannot be started' })
  async startService(@Param('id', ParseUUIDPipe) id: string, @Param('serviceId') serviceId: string): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.manageWorkOrderServicesService.startService(id, serviceId);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Post(':id/services/:serviceId/complete')
  @ApiOperation({ summary: 'Complete service execution' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service completed successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or service not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service cannot be completed' })
  async completeService(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('serviceId') serviceId: string,
    @Body() dto: CompleteServiceDto
  ): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.manageWorkOrderServicesService.completeService(id, serviceId, dto);
    return new WorkOrderDetailedResponseDto(workOrder);
  }

  @Post(':id/services/:serviceId/cancel')
  @ApiOperation({ summary: 'Cancel service' })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service cancelled successfully', type: WorkOrderDetailedResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or service not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service cannot be cancelled' })
  async cancelService(@Param('id', ParseUUIDPipe) id: string, @Param('serviceId') serviceId: string): Promise<WorkOrderDetailedResponseDto> {
    const workOrder = await this.manageWorkOrderServicesService.cancelService(id, serviceId);
    return new WorkOrderDetailedResponseDto(workOrder);
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
