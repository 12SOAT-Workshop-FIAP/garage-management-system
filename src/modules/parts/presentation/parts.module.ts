import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { Part } from '../domain/part.entity';

// Application Services
import { CreatePartService } from '../application/services/create-part.service';
import { FindPartByIdService } from '../application/services/find-part-by-id.service';
import { FindAllPartsService } from '../application/services/find-all-parts.service';
import { UpdatePartService } from '../application/services/update-part.service';
import { DeletePartService } from '../application/services/delete-part.service';
import { UpdateStockService } from '../application/services/update-stock.service';

// Infrastructure
import { PartTypeormRepository } from '../infrastructure/repositories/part.typeorm.repository';

// Presentation
import { PartController } from './controllers/part.controller';

/**
 * PartsModule (Módulo de Peças/Insumos)
 * NestJS module for parts and supplies management.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Part]),
  ],
  controllers: [PartController],
  providers: [
    CreatePartService,
    FindPartByIdService,
    FindAllPartsService,
    UpdatePartService,
    DeletePartService,
    UpdateStockService,
    {
      provide: 'PartRepository',
      useClass: PartTypeormRepository,
    },
  ],
})
export class PartsModule {}
