import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Part } from '../domain/entities/part.entity';
import { PartRepository } from '../domain/repositories/part.repository';
import { CreatePartUseCase } from '../application/use-cases/create-part.use-case';
import { DeletePartUseCase } from '../application/use-cases/delete-part.use-case';
import { FindPartByIdUseCase } from '../application/use-cases/find-part-by-id.use-case';
import { UpdateStockUseCase } from '../application/use-cases/update-stock.use-case';
import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case';

describe('Parts Use Cases', () => {
  let repository: jest.Mocked<PartRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPartNumber: jest.fn(),
      findByCategory: jest.fn(),
      findLowStockParts: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateStock: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      save: jest.fn(),
    } as any;
    jest.clearAllMocks();
  });

  describe('CreatePartUseCase', () => {
    it('should create a new part', async () => {
      const useCase = new CreatePartUseCase(repository);
      const command = {
        name: 'Filtro de Óleo',
        description: 'Filtro para motor',
        partNumber: 'FO-001',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'PC',
        supplier: 'Auto Peças Central',
      };
      repository.findByPartNumber.mockResolvedValue(null);
      repository.create.mockResolvedValue(Part.create(command));
      const result = await useCase.execute(command);
      expect(result).toBeInstanceOf(Part);
      expect(repository.create).toHaveBeenCalledWith(expect.any(Part));
    });

    it('should throw ConflictException if part number exists', async () => {
      const useCase = new CreatePartUseCase(repository);
      const command = {
        name: 'Filtro de Óleo',
        description: 'Filtro para motor',
        partNumber: 'FO-001',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'PC',
        supplier: 'Auto Peças Central',
      };
      repository.findByPartNumber.mockResolvedValue(Part.create(command));
      await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
    });
  });

  describe('DeletePartUseCase', () => {
    it('should delete a part by id', async () => {
      const useCase = new DeletePartUseCase(repository);
      const part = Part.create({
        name: 'Filtro de Óleo',
        description: 'Filtro para motor',
        partNumber: 'FO-001',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'PC',
        supplier: 'Auto Peças Central',
      });
      repository.findById.mockResolvedValue(part);
      repository.delete.mockResolvedValue();
      const command = { id: 1 };
      await useCase.execute(command);
      expect(repository.delete).toHaveBeenCalledWith(part);
    });

    it('should throw NotFoundException if part not found', async () => {
      const useCase = new DeletePartUseCase(repository);
      repository.findById.mockResolvedValue(null);
      const command = { id: 999 };
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindPartByIdUseCase', () => {
    it('should return part by id', async () => {
      const useCase = new FindPartByIdUseCase(repository);
      const part = Part.create({
        name: 'Filtro de Óleo',
        description: 'Filtro para motor',
        partNumber: 'FO-001',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'PC',
        supplier: 'Auto Peças Central',
      });
      repository.findById.mockResolvedValue(part);
      const query = { id: 1 };
      const result = await useCase.execute(query);
      expect(result).toEqual(part);
    });

    it('should return null if part not found', async () => {
      const useCase = new FindPartByIdUseCase(repository);
      repository.findById.mockResolvedValue(null);
      const query = { id: 999 };
      const result = await useCase.execute(query);
      expect(result).toBeNull();
    });
  });

  describe('UpdateStockUseCase', () => {
    it('should update stock quantity', async () => {
      const useCase = new UpdateStockUseCase(repository);
      const part = Part.create({
        name: 'Filtro de Óleo',
        description: 'Filtro para motor',
        partNumber: 'FO-001',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'PC',
        supplier: 'Auto Peças Central',
      });
      repository.updateStock.mockResolvedValue(part);
      const command = { id: 1, quantity: 5 };
      const result = await useCase.execute(command);
      expect(result).toEqual(part);
      expect(repository.updateStock).toHaveBeenCalledWith(1, 5);
    });

    it('should return null if part not found', async () => {
      const useCase = new UpdateStockUseCase(repository);
      repository.updateStock.mockResolvedValue(null);
      const command = { id: 999, quantity: 5 };
      const result = await useCase.execute(command);
      expect(result).toBeNull();
    });
  });

  describe('UpdatePartUseCase', () => {
    it('should update part fields', async () => {
      const useCase = new UpdatePartUseCase(repository);
      const part = Part.create({
        name: 'Filtro de Óleo',
        description: 'Filtro para motor',
        partNumber: 'FO-001',
        category: 'filtros',
        price: 45.9,
        costPrice: 32.15,
        stockQuantity: 10,
        minStockLevel: 2,
        unit: 'PC',
        supplier: 'Auto Peças Central',
      });
      const updateDto = {
        name: 'Filtro de Óleo Premium',
        price: 49.9,
        description: undefined,
        category: undefined,
        costPrice: undefined,
        minStockLevel: undefined,
        unit: undefined,
        supplier: undefined,
      };
      repository.findById.mockResolvedValue(part);
      repository.update.mockResolvedValue(Part.restore({
        id: 1,
        name: updateDto.name || part.name.value,
        description: updateDto.description || part.description.value,
        partNumber: part.partNumber.value,
        category: updateDto.category || part.category.value,
        price: updateDto.price || part.price.value,
        costPrice: updateDto.costPrice || part.costPrice.value,
        stockQuantity: part.stockQuantity.value,
        minStockLevel: updateDto.minStockLevel || part.minStockLevel,
        unit: updateDto.unit || part.unit.value,
        supplier: updateDto.supplier || part.supplier.value,
        active: true,
        createdAt: part.createdAt,
        updatedAt: new Date(),
      }));
      const result = await useCase.execute('1', updateDto);
      expect(result.name.value).toBe('Filtro de Óleo Premium');
      expect(result.price.value).toBe(49.9);
      expect(repository.update).toHaveBeenCalledWith(expect.any(Part), expect.objectContaining(updateDto));
    });

    it('should throw NotFoundException if part not found', async () => {
      const useCase = new UpdatePartUseCase(repository);
      repository.findById.mockResolvedValue(null);
      const updateDto = { name: 'Novo' };
      await expect(useCase.execute('999', updateDto)).rejects.toThrow(NotFoundException);
    });
  });
});
