import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePartUseCase } from './application/use-cases/create-part.use-case';
import { DeletePartUseCase } from './application/use-cases/delete-part.use-case';
import { FindAllPartsUseCase } from './application/use-cases/find-all-parts.use-case';
import { FindPartByIdUseCase } from './application/use-cases/find-part-by-id.use-case';
import { UpdatePartUseCase } from './application/use-cases/update-part.use-case';
import { UpdateStockUseCase } from './application/use-cases/update-stock.use-case';
import { PartOrmEntity } from './infrastructure/entities/part-orm.entity';
import { PartTypeOrmRepository } from './infrastructure/adapters/repositories/part-typeorm.repository';
import { PartController } from './presentation/controllers/part.controller';
import { PartRepository } from './domain/repositories/part.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PartOrmEntity])],
  controllers: [PartController],
  providers: [
    CreatePartUseCase,
    UpdatePartUseCase,
    UpdateStockUseCase,
    DeletePartUseCase,
    FindAllPartsUseCase,
    FindPartByIdUseCase,
    {
      provide: PartRepository,
      useClass: PartTypeOrmRepository,
    },
  ],
  exports: [PartRepository],
})
export class PartsModule {}
