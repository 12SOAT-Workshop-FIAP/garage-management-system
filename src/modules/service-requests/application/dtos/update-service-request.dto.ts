import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsIn } from 'class-validator';

export class UpdateServiceRequestDto {
  @ApiPropertyOptional({ description: 'Description of the problem or requested service' })
  @IsOptional()
  @IsString()
  @Length(5, 500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Status of the service request',
    enum: ['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'],
  })
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
}
