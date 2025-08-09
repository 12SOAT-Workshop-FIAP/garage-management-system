import { Test } from '@nestjs/testing';
import { ServicesModule } from '../services.module';
import { CreateServiceService } from '../application/services/create-service.service';
import { UpdateServiceService } from '../application/services/update-service.service';
import { DeleteServiceService } from '../application/services/delete-service.service';
import { FindAllServicesService } from '../application/services/find-all-services.service';
import { FindServiceByIdService } from '../application/services/find-service-by-id.service';
import { ServiceController } from '../presentation/controllers/service.controller';
import {
  ServiceTypeOrmRepository,
} from '../infrastructure/repositories/service.typeorm.repository';

describe('ServicesModule', () => {
  it('should be defined', () => {
    expect(ServicesModule).toBeDefined();
  });

  it('should have proper module structure', () => {
    const moduleMetadata = Reflect.getMetadata('imports', ServicesModule);
    const controllersMetadata = Reflect.getMetadata('controllers', ServicesModule);
    const providersMetadata = Reflect.getMetadata('providers', ServicesModule);

    expect(moduleMetadata).toBeDefined();
    expect(controllersMetadata).toBeDefined();
    expect(providersMetadata).toBeDefined();
  });

  it('should have all required service classes defined', () => {
    expect(CreateServiceService).toBeDefined();
    expect(UpdateServiceService).toBeDefined();
    expect(DeleteServiceService).toBeDefined();
    expect(FindAllServicesService).toBeDefined();
    expect(FindServiceByIdService).toBeDefined();
    expect(ServiceController).toBeDefined();
    expect(ServiceTypeOrmRepository).toBeDefined();
  });

  it('should have proper class inheritance and structure', () => {
    expect(typeof CreateServiceService).toBe('function');
    expect(typeof UpdateServiceService).toBe('function');
    expect(typeof DeleteServiceService).toBe('function');
    expect(typeof FindAllServicesService).toBe('function');
    expect(typeof FindServiceByIdService).toBe('function');
    expect(typeof ServiceController).toBe('function');
    expect(typeof ServiceTypeOrmRepository).toBe('function');
  });

  it('should have proper module exports', () => {
    expect(ServicesModule).toHaveProperty('name');
    expect(typeof ServicesModule).toBe('function');
  });
});
