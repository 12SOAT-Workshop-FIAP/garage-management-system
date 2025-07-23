import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { UpdateServiceDto } from '../../application/dtos/update-service.dto';
import { CreateServiceService } from '../../application/services/create-service.service';
import { DeleteServiceService } from '../../application/services/delete-service.service';
import { FindAllServicesService } from '../../application/services/find-all-services.service';
import { FindServiceByIdService } from '../../application/services/find-service-by-id.service';
import { UpdateServiceService } from '../../application/services/update-service.service';
import { ServiceResponseDto } from '../dtos/service-response.dto';

@Controller('services')
export class ServiceController {
  constructor(
    private readonly createService: CreateServiceService,
    private readonly updateService: UpdateServiceService,
    private readonly deleteService: DeleteServiceService,
    private readonly findAllServices: FindAllServicesService,
    private readonly findServiceById: FindServiceByIdService,
  ) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    const service = await this.createService.execute(createServiceDto);
    return new ServiceResponseDto(service);
  }

  @Get()
  async findAll() {
    const services = await this.findAllServices.execute();
    return services.map((service) => new ServiceResponseDto(service));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.findServiceById.execute(id);
    return new ServiceResponseDto(service);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const service = await this.updateService.execute(id, updateServiceDto);
    return new ServiceResponseDto(service);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteService.execute(id);
  }
}
