import { FindAllUsersUseCase } from '../find-all-users.use-case';
import { FindAllUsersQuery } from '../../queries/find-all-users.query';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/user.entity';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    useCase = new FindAllUsersUseCase(mockRepository);
  });

  it('should return all users successfully', async () => {
    const query = new FindAllUsersQuery();
    const users = [
      User.restore({
        id: '12345678-1234-1234-1234-123456789012',
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      User.restore({
        id: '87654321-4321-4321-4321-210987654321',
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockRepository.findAll.mockResolvedValue(users);

    const result = await useCase.execute(query);

    expect(mockRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(users);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no users found', async () => {
    const query = new FindAllUsersQuery();

    mockRepository.findAll.mockResolvedValue(null);

    const result = await useCase.execute(query);

    expect(mockRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return empty array when users array is empty', async () => {
    const query = new FindAllUsersQuery();

    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute(query);

    expect(mockRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
