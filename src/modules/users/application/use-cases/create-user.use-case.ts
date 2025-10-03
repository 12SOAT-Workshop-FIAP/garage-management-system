import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserCommand } from '../commands/create-user.command';
import { User } from '../../domain/user.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.cryptographyPort.hashPassword(command.password);

    const user = User.create({
      name: command.name,
      email: command.email,
      password: hashedPassword,
      status: command.isActive,
    });

    return await this.userRepository.create(user);
  }
}
