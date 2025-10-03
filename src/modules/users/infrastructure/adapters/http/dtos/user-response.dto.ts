import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { User } from '../../../../domain/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'User unique identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'User name' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'User email' })
  @Expose()
  email!: string;

  @ApiProperty({ description: 'User active status' })
  @Expose()
  isActive!: boolean;

  @ApiProperty({ description: 'User creation date' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'User last update date' })
  @Expose()
  updatedAt!: Date;

  constructor(user: User) {
    this.id = user.id?.value || '';
    this.name = user.name.value;
    this.email = user.email.value;
    this.isActive = user.status.value;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
