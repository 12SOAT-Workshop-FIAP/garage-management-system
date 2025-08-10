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
import { AddPartToWorkOrderDto } from '../../application/dtos/add-part-to-work-order.dto';
import { UpdatePartQuantityDto } from '../../application/dtos/update-part-quantity.dto';
import { WorkOrderPartResponseDto } from '../../application/dtos/work-order-part-response.dto';
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
import { AddPartToWorkOrderService } from '../../application/services/add-part-to-work-order.service';
import { RemovePartFromWorkOrderService } from '../../application/services/remove-part-from-work-order.service';
import { UpdatePartQuantityService } from '../../application/services/update-part-quantity.service';
import { ApprovePartService } from '../../application/services/approve-part.service';
import { ApplyPartService } from '../../application/services/apply-part.service';
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
    private readonly addPartToWorkOrderService: AddPartToWorkOrderService,
    private readonly removePartFromWorkOrderService: RemovePartFromWorkOrderService,
    private readonly updatePartQuantityService: UpdatePartQuantityService,
    private readonly approvePartService: ApprovePartService,
    private readonly applyPartService: ApplyPartService,
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

  // ========== PARTS MANAGEMENT ENDPOINTS ==========

  @Post(':id/parts')
  @ApiOperation({ 
    summary: 'Add part to work order',
    description: 'Add a part/material to a work order with specified quantity and optional price override'
  })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Part added to work order successfully' 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or part not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Insufficient stock or invalid data' })
  async addPart(
    @Param('id', ParseUUIDPipe) workOrderId: string,
    @Body() dto: AddPartToWorkOrderDto
  ): Promise<void> {
    await this.addPartToWorkOrderService.execute(workOrderId, dto);
  }

  @Put(':id/parts/:partId/quantity')
  @ApiOperation({ 
    summary: 'Update part quantity in work order',
    description: 'Update the quantity of a specific part in the work order'
  })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'partId', description: 'Part ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Part quantity updated successfully' 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or part not found' })
  async updatePartQuantity(
    @Param('id', ParseUUIDPipe) workOrderId: string,
    @Param('partId', ParseUUIDPipe) partId: string,
    @Body() dto: UpdatePartQuantityDto
  ): Promise<void> {
    await this.updatePartQuantityService.execute(workOrderId, partId, dto);
  }

  @Delete(':id/parts/:partId')
  @ApiOperation({ 
    summary: 'Remove part from work order',
    description: 'Remove a part from the work order completely'
  })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'partId', description: 'Part ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Part removed from work order successfully' 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or part not found' })
  async removePart(
    @Param('id', ParseUUIDPipe) workOrderId: string,
    @Param('partId', ParseUUIDPipe) partId: string
  ): Promise<void> {
    await this.removePartFromWorkOrderService.execute(workOrderId, partId);
  }

  @Post(':id/parts/:partId/approve')
  @ApiOperation({ 
    summary: 'Approve part for use',
    description: 'Approve a part for use in the work order (customer/supervisor approval)'
  })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'partId', description: 'Part ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Part approved successfully' 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or part not found' })
  async approvePart(
    @Param('id', ParseUUIDPipe) workOrderId: string,
    @Param('partId', ParseUUIDPipe) partId: string
  ): Promise<void> {
    await this.approvePartService.execute(workOrderId, partId);
  }

  @Post(':id/parts/:partId/apply')
  @ApiOperation({ 
    summary: 'Apply part to work order',
    description: 'Mark a part as applied/used in the work order (reduces stock)'
  })
  @ApiParam({ name: 'id', description: 'Work order ID' })
  @ApiParam({ name: 'partId', description: 'Part ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Part applied successfully' 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Work order or part not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Part must be approved before applying' })
  async applyPart(
    @Param('id', ParseUUIDPipe) workOrderId: string,
    @Param('partId', ParseUUIDPipe) partId: string
  ): Promise<void> {
    await this.applyPartService.execute(workOrderId, partId);
  }
}
