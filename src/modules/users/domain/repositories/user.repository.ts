import { User } from '../user.entity';

export abstract class UserRepository {
  abstract findAll(): Promise<User[] | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract update(oldUser: User, newUser: User): Promise<User | null>;
  abstract delete(user: User): Promise<void>;
}
