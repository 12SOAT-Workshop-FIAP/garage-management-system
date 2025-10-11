import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { DeleteUserCommand } from '../commands/delete-user.command';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);
    if (!user || !user.status.isActive) {
      throw new NotFoundException(`User with ID ${command.id} not found`);
    }

    if (!user.canBeDeleted()) {
      throw new Error('User cannot be deleted');
    }

    user.deactivate();

    await this.userRepository.update(user, user);
  }
}
