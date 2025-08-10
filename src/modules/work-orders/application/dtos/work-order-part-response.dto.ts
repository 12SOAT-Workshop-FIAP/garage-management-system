import { ApiProperty } from '@nestjs/swagger';

/**
 * WorkOrderPartResponseDto
 * DTO de resposta para peças de ordem de serviço
 */
export class WorkOrderPartResponseDto {
  @ApiProperty({ description: 'Part ID' })
  partId!: string;

  @ApiProperty({ description: 'Part name' })
  partName!: string;

  @ApiProperty({ description: 'Part description' })
  partDescription!: string;

  @ApiProperty({ description: 'Part number' })
  partNumber!: string;

  @ApiProperty({ description: 'Quantity needed' })
  quantity!: number;

  @ApiProperty({ description: 'Unit price' })
  unitPrice!: number;

  @ApiProperty({ description: 'Total price (quantity × unit price)' })
  totalPrice!: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Whether the part is approved for use' })
  isApproved!: boolean;

  @ApiProperty({ description: 'Date when the part was applied', required: false })
  appliedAt?: Date;

  static fromDomain(part: any): WorkOrderPartResponseDto {
    const dto = new WorkOrderPartResponseDto();
    dto.partId = part.partId;
    dto.partName = part.partName;
    dto.partDescription = part.partDescription;
    dto.partNumber = part.partNumber;
    dto.quantity = part.quantity;
    dto.unitPrice = part.unitPrice;
    dto.totalPrice = part.totalPrice;
    dto.notes = part.notes;
    dto.isApproved = part.isApproved;
    dto.appliedAt = part.appliedAt;
    return dto;
  }
}
