import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserService } from './application/services/create-user.service';
import { DeleteUserService } from './application/services/delete-user.service';
import { FindAllUsersService } from './application/services/find-all-users.service';
import { FindUserByIdService } from './application/services/find-user-by-id.service';
import { UpdateUserService } from './application/services/update-user.service';
import { User } from './infrastructure/entities/user.entity';
import {
  USER_REPOSITORY,
  UserTypeOrmRepository,
} from './infrastructure/repositories/user.typeorm.repository';
import { UserController } from './presentation/controllers/user.controller';
import { HashPasswordPipe } from '../../pipes/hash-password.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
    FindAllUsersService,
    FindUserByIdService,
    HashPasswordPipe,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
})
export class UsersModule {}
