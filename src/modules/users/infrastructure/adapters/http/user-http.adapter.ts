import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { CreateUserCommand } from '../../../application/commands/create-user.command';
import { UpdateUserCommand } from '../../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../../application/commands/delete-user.command';
import { FindUserByIdQuery } from '../../../application/queries/find-user-by-id.query';
import { FindUserByEmailQuery } from '../../../application/queries/find-user-by-email.query';
import { FindAllUsersQuery } from '../../../application/queries/find-all-users.query';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { FindUserByIdUseCase } from '../../../application/use-cases/find-user-by-id.use-case';
import { FindUserByEmailUseCase } from '../../../application/use-cases/find-user-by-email.use-case';
import { FindAllUsersUseCase } from '../../../application/use-cases/find-all-users.use-case';
import { IsPublic } from '../../../../auth/presentation/decorators/is-public.decorator';

@ApiTags('users')
@Controller('users')
export class UserHttpAdapter {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    const query = new FindAllUsersQuery();
    const users = await this.findAllUsersUseCase.execute(query);
    return users.map((user) => new UserResponseDto(user));
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiParam({
    name: 'email',
    description: 'User email address',
    example: 'user@example.com',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const query = new FindUserByEmailQuery(email);
    const user = await this.findUserByEmailUseCase.execute(query);
    return new UserResponseDto(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const query = new FindUserByIdQuery(id);
    const user = await this.findUserByIdUseCase.execute(query);
    return new UserResponseDto(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with email already exists' })
  @IsPublic()
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    const command = new CreateUserCommand(dto.name, dto.email, dto.password, dto.isActive);
    const user = await this.createUserUseCase.execute(command);
    return new UserResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with email already exists' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const command = new UpdateUserCommand(id, dto.name, dto.email, dto.password, dto.isActive);
    const user = await this.updateUserUseCase.execute(command);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand(id);
    await this.deleteUserUseCase.execute(command);
  }
}
