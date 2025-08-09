import { ApiProperty } from '@nestjs/swagger';

/**
 * Example DTOs for Swagger documentation
 */

export class CustomerIdentificationExampleDto {
  @ApiProperty({
    description: 'Example of customer identification by CPF',
    example: {
      customerDocument: '123.456.789-00',
      vehicleId: '550e8400-e29b-41d4-a716-446655440000',
      description: 'Troca de óleo e filtro do motor',
      diagnosis: 'Óleo escuro, necessário substituição',
      estimatedCost: 150.00
    }
  })
  cpfExample!: any;

  @ApiProperty({
    description: 'Example of customer identification by CNPJ',
    example: {
      customerDocument: '12.345.678/0001-90',
      vehicleId: '550e8400-e29b-41d4-a716-446655440001',
      description: 'Manutenção preventiva da frota',
      diagnosis: 'Revisão de 10.000 km',
      estimatedCost: 500.00
    }
  })
  cnpjExample!: any;

  @ApiProperty({
    description: 'Example of work order response',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      customerId: '1',
      vehicleId: '550e8400-e29b-41d4-a716-446655440000',
      description: 'Troca de óleo e filtro do motor',
      status: 'pending',
      estimatedCost: 150.00,
      actualCost: null,
      laborCost: null,
      partsCost: null,
      diagnosis: 'Óleo escuro, necessário substituição',
      technicianNotes: null,
      customerApproval: false,
      estimatedCompletionDate: null,
      completedAt: null,
      createdAt: '2025-08-08T10:30:00.000Z',
      updatedAt: '2025-08-08T10:30:00.000Z'
    }
  })
  workOrderResponse!: any;
}
