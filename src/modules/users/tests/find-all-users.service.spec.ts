import { FindAllUsersService } from '../application/services/find-all-users.service';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

describe('FindAllUsersService', () => {
  let findAllUsersService: FindAllUsersService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    findAllUsersService = new FindAllUsersService(mockUserRepository);
  });

  it('should return all users when users exist', async () => {
    const mockUsers = [
      new User(
        {
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'hashedpassword1',
          isActive: true,
        },
        'id-1',
      ),
      new User(
        {
          name: 'Maria Santos',
          email: 'maria@example.com',
          password: 'hashedpassword2',
          isActive: true,
        },
        'id-2',
      ),
      new User(
        {
          name: 'Pedro Costa',
          email: 'pedro@example.com',
          password: 'hashedpassword3',
          isActive: false,
        },
        'id-3',
      ),
    ];

    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    const result = await findAllUsersService.execute();

    expect(result).toEqual(mockUsers);
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(User);
    expect(result[0].name).toBe('João Silva');
    expect(result[1].name).toBe('Maria Santos');
    expect(result[2].name).toBe('Pedro Costa');
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no users exist', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await findAllUsersService.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
