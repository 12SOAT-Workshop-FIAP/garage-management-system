import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { FindUserByIdQuery } from '../queries/find-user-by-id.query';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: FindUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found`);
    }

    return user;
  }
}
