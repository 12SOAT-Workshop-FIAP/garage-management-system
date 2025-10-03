import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { FindAllUsersQuery } from '../queries/find-all-users.query';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(_query: FindAllUsersQuery): Promise<User[]> {
    const users = await this.userRepository.findAll();

    if (!users || users.length === 0) {
      return [];
    }

    return users;
  }
}
