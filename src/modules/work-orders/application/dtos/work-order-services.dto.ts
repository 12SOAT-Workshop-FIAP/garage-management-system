import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for adding a service to a work order
 */
export class AddServiceToWorkOrderDto {
  @ApiProperty({ 
    description: 'Service ID from the services catalog',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  serviceId!: string;

  @ApiProperty({ 
    description: 'Quantity of this service',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ 
    description: 'Unit price override (optional, uses catalog price if not provided)',
    example: 150.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiProperty({ 
    description: 'Technician notes for this specific service',
    example: 'Use synthetic oil',
    required: false
  })
  @IsOptional()
  @IsString()
  technicianNotes?: string;
}

/**
 * DTO for updating a service in a work order
 */
export class UpdateWorkOrderServiceDto {
  @ApiProperty({ 
    description: 'New quantity for the service',
    example: 2,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiProperty({ 
    description: 'New unit price for the service',
    example: 175.00,
    minimum: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiProperty({ 
    description: 'Updated technician notes',
    example: 'Changed to premium oil per customer request',
    required: false
  })
  @IsOptional()
  @IsString()
  technicianNotes?: string;
}

/**
 * DTO for service item in work order creation
 */
export class WorkOrderServiceItemDto {
  @ApiProperty({ 
    description: 'Service ID from catalog',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  serviceId!: string;

  @ApiProperty({ 
    description: 'Quantity needed',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ 
    description: 'Custom unit price (optional)',
    example: 150.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiProperty({ 
    description: 'Special notes for this service',
    example: 'Customer prefers specific brand',
    required: false
  })
  @IsOptional()
  @IsString()
  technicianNotes?: string;
}

/**
 * DTO for creating work order with services included
 */
export class CreateWorkOrderWithServicesDto {
  @ApiProperty({ 
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  customerId!: string;

  @ApiProperty({ 
    description: 'Vehicle ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  vehicleId!: string;

  @ApiProperty({ 
    description: 'Work order description',
    example: 'Regular maintenance service'
  })
  @IsString()
  description!: string;

  @ApiProperty({ 
    description: 'Initial diagnosis (optional)',
    example: 'Engine oil needs replacement, brake pads worn',
    required: false
  })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ 
    description: 'List of services to include',
    type: [WorkOrderServiceItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderServiceItemDto)
  services!: WorkOrderServiceItemDto[];
}

/**
 * DTO for completing a service
 */
export class CompleteServiceDto {
  @ApiProperty({ 
    description: 'Final technician notes for the completed service',
    example: 'Service completed successfully. Used synthetic oil as requested.',
    required: false
  })
  @IsOptional()
  @IsString()
  technicianNotes?: string;
}
