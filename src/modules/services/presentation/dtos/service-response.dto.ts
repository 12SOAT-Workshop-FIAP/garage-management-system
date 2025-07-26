import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../domain/service.entity';

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service unique identifier' })
  id: string;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiProperty({ description: 'Service description' })
  description: string;

  @ApiProperty({ description: 'Service price' })
  price: number;

  @ApiProperty({ description: 'Service active' })
  active: boolean;

  @ApiProperty({ description: 'Service duration' })
  duration: number;

  @ApiProperty({ description: 'Service creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Service last update date' })
  updatedAt: Date;

  constructor(service: Service) {
    this.id = service.id;
    this.name = service.name;
    this.description = service.description;
    this.active = service.active;
    this.duration = service.duration;
    this.price = service.price;
    this.createdAt = service.createdAt;
    this.updatedAt = service.updatedAt;
  }
}
