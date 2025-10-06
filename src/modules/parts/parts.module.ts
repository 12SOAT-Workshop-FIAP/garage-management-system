import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartEntity } from './infrastructure/entities/part.entity';
import { PartController } from './presentation/controllers/part.controller';
import { CreatePartUseCase } from './application/use-cases/create-part.use-case';
import { FindAllPartsUseCase } from './application/use-cases/find-all-parts.use-case';
import { FindPartByIdUseCase } from './application/use-cases/find-part-by-id.use-case';
import { FindPartByPartNumberUseCase } from './application/use-cases/find-part-by-part-number.use-case';
import { FindLowStockPartsUseCase } from './application/use-cases/find-low-stock-parts.use-case';
import { UpdateStockUseCase } from './application/use-cases/update-stock.use-case';
import { DeletePartUseCase } from './application/use-cases/delete-part.use-case';
import { PartRepository } from './domain/repositories/part.repository';
import { PartTypeOrmRepository } from './infrastructure/adapters/repositories/part-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PartEntity])],
  controllers: [PartController],
  providers: [
    // Use Cases
    CreatePartUseCase,
    FindAllPartsUseCase,
    FindPartByIdUseCase,
    FindPartByPartNumberUseCase,
    FindLowStockPartsUseCase,
    UpdateStockUseCase,
    DeletePartUseCase,
    // Ports and Adapters
    { provide: PartRepository, useClass: PartTypeOrmRepository },
  ],
  exports: [
    FindPartByPartNumberUseCase,
    { provide: PartRepository, useClass: PartTypeOrmRepository },
  ],
})
export class PartsModule {}
