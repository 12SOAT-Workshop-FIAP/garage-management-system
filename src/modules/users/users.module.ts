import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHttpAdapter } from './infrastructure/adapters/http/user-http.adapter';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { UserTypeOrmRepository } from './infrastructure/repositories/user.typeorm.repository';
import { CryptographyPort } from './domain/ports/cryptography.port';
import { CryptographyAdapter } from './infrastructure/adapters/cryptography/cryptography.adapter';
import { User as UserEntity } from './infrastructure/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserHttpAdapter],
  providers: [
    // Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    FindAllUsersUseCase,
    // Ports and Adapters
    { provide: UserRepository, useClass: UserTypeOrmRepository },
    { provide: CryptographyPort, useClass: CryptographyAdapter },
  ],
  exports: [FindUserByEmailUseCase, { provide: UserRepository, useClass: UserTypeOrmRepository }],
})
export class UsersModule {}
