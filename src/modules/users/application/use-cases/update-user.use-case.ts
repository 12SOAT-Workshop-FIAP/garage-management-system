import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserCommand } from '../commands/update-user.command';
import { User } from '../../domain/user.entity';
import { CryptographyPort } from '../../domain/ports/cryptography.port';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findById(command.id);

    if (!existingUser || !existingUser.status.isActive) {
      throw new NotFoundException(`User with id ${command.id} not found`);
    }

    if (!existingUser.canBeUpdated()) {
      throw new Error('User cannot be updated');
    }

    if (command.email && command.email !== existingUser.email.value) {
      const userWithEmail = await this.userRepository.findByEmail(command.email);
      if (userWithEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = User.restore({
      id: existingUser.id?.value || command.id,
      name: command.name || existingUser.name.value,
      email: command.email || existingUser.email.value,
      password: command.password
        ? await this.cryptographyPort.hashPassword(command.password)
        : existingUser.password.value,
      status: command.isActive !== undefined ? command.isActive : existingUser.status.value,
      createdAt: existingUser.createdAt,
      updatedAt: new Date(),
    });

    const result = await this.userRepository.update(existingUser, updatedUser);
    if (!result) {
      throw new Error('Failed to update user');
    }
    return result;
  }
}
