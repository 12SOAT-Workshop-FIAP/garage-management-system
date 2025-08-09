import { User } from './user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract update(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
