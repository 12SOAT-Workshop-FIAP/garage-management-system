import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { FindUserByEmailQuery } from '../queries/find-user-by-email.query';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: FindUserByEmailQuery): Promise<User> {
    const user = await this.userRepository.findByEmail(query.email);

    if (!user) {
      throw new NotFoundException(`User with email ${query.email} not found`);
    }

    return user;
  }
}
