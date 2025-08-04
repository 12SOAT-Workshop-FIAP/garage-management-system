import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateServiceService } from './application/services/create-service.service';
import { DeleteServiceService } from './application/services/delete-service.service';
import { FindAllServicesService } from './application/services/find-all-services.service';
import { FindServiceByIdService } from './application/services/find-service-by-id.service';
import { UpdateServiceService } from './application/services/update-service.service';
import { Service } from './infrastructure/entities/service.entity';
import {
  ServiceTypeOrmRepository,
  SERVICE_REPOSITORY,
} from './infrastructure/repositories/service.typeorm.repository';
import { ServiceController } from './presentation/controllers/service.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServiceController],
  providers: [
    CreateServiceService,
    UpdateServiceService,
    DeleteServiceService,
    FindAllServicesService,
    FindServiceByIdService,
    {
      provide: SERVICE_REPOSITORY,
      useClass: ServiceTypeOrmRepository,
    },
  ],
})
export class ServicesModule {}
