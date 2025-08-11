import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@modules/auth/presentation/decorators/is-public.decorator';
import { FindWorkOrderService } from '../../application/services/find-work-order.service';
import { FindByDocumentCustomerService } from '@modules/customers/application/services/find-by-document-customer.service';
import { PublicWorkOrderStatusDto } from '../dtos/public-work-order-status.dto';

@ApiTags('public-work-orders')
@Controller('public/work-orders')
export class PublicWorkOrderController {
  constructor(
    private readonly findWorkOrderService: FindWorkOrderService,
    private readonly findByDocumentCustomerService: FindByDocumentCustomerService,
  ) {}

  @Get(':id/status')
  @IsPublic()
  @ApiOperation({ summary: 'Get public status of a work order' })
  @ApiParam({ name: 'id', description: 'Work order ID (UUID)' })
  @ApiQuery({
    name: 'document',
    description: 'Customer CPF or CNPJ used to validate access',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work order status retrieved',
    type: PublicWorkOrderStatusDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid document parameter' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Work order not found or does not belong to the provided document',
  })
  async getStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('document') document?: string,
  ): Promise<PublicWorkOrderStatusDto> {
    if (!document) {
      throw new BadRequestException('Query param "document" (CPF/CNPJ) is required');
    }

    // Find the work order
    const workOrder = await this.findWorkOrderService.findById(id);

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    // Validate customer by document and ensure ownership
    const customer = await this.findByDocumentCustomerService.execute(document);
    if (!customer || workOrder.customerId !== customer.id.toString()) {
      throw new NotFoundException('Work order not found for the provided document');
    }

    return PublicWorkOrderStatusDto.fromDomain(workOrder);
  }
}
