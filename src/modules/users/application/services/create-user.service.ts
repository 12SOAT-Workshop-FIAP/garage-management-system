import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new User({
      ...createUserDto,
    });

    await this.userRepository.create(user);

    return user;
  }
}
