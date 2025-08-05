import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePartService } from './application/services/create-part.service';
import { DeletePartService } from './application/services/delete-part.service';
import { FindAllPartsService } from './application/services/find-all-parts.service';
import { FindPartByIdService } from './application/services/find-part-by-id.service';
import { UpdatePartService } from './application/services/update-part.service';
import { UpdateStockService } from './application/services/update-stock.service';
import { Part } from './infrastructure/entities/part.entity';
import {
  PartTypeOrmRepository,
  PART_REPOSITORY,
} from './infrastructure/repositories/part.typeorm.repository';
import { PartController } from './presentation/controllers/part.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Part])],
  controllers: [PartController],
  providers: [
    CreatePartService,
    UpdatePartService,
    UpdateStockService,
    DeletePartService,
    FindAllPartsService,
    FindPartByIdService,
    {
      provide: PART_REPOSITORY,
      useClass: PartTypeOrmRepository,
    },
  ],
})
export class PartsModule {}
