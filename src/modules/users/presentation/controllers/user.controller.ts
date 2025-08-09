import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserService } from '../../application/services/create-user.service';
import { DeleteUserService } from '../../application/services/delete-user.service';
import { FindAllUsersService } from '../../application/services/find-all-users.service';
import { FindUserByIdService } from '../../application/services/find-user-by-id.service';
import { UpdateUserService } from '../../application/services/update-user.service';
import { HashPasswordPipe } from '../../../../pipes/hash-password.pipe';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IsPublic } from '../../../auth/presentation/decorators/is-public.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserService,
    private readonly updateUser: UpdateUserService,
    private readonly deleteUser: DeleteUserService,
    private readonly findAllUsers: FindAllUsersService,
    private readonly findUserById: FindUserByIdService,
  ) {}

  @Post()
  @IsPublic()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Body('password', HashPasswordPipe) passwordHashed: string,
  ) {
    createUserDto.password = passwordHashed;
    const user = await this.createUser.execute(createUserDto);
    return new UserResponseDto(user);
  }

  @Get()
  async findAll() {
    const users = await this.findAllUsers.execute();
    return users.map((user) => new UserResponseDto(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.findUserById.execute(id);
    return new UserResponseDto(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Body('password', HashPasswordPipe) passwordHashed: string,
  ) {
    if (updateUserDto.password) {
      updateUserDto.password = passwordHashed;
    }
    const user = await this.updateUser.execute(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute(id);
  }
}
