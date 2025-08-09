import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);

    user.updatedAt = new Date();

    await this.userRepository.update(user);

    return user;
  }
}
