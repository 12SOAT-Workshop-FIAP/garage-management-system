import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../src/modules/users/users.module';
import { User } from '../../src/modules/users/infrastructure/entities/user.entity';
import { compare } from 'bcrypt';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user successfully', () => {
      const createUserDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.isActive).toBe(createUserDto.isActive);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          // Password should not be returned in response
          expect(res.body).not.toHaveProperty('password');
          createdUserId = res.body.id;
        });
    });

    it('should fail with invalid data', () => {
      const invalidDto = {
        name: '',
        email: 'invalid-email',
        password: '123', // too short
        isActive: 'invalid',
      };

      return request(app.getHttpServer()).post('/users').send(invalidDto).expect(400);
    });

    it('should fail with missing required fields', () => {
      const incompleteDto = {
        name: 'Test User',
        // missing email and password
      };

      return request(app.getHttpServer()).post('/users').send(incompleteDto).expect(400);
    });

    it('should fail with duplicate email', async () => {
      const createUserDto = {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password123',
        isActive: true,
      };

      // Create first user
      await request(app.getHttpServer()).post('/users').send(createUserDto).expect(201);

      // Try to create second user with same email
      return request(app.getHttpServer()).post('/users').send(createUserDto).expect(409);
    });

    it('should hash password correctly when creating user', async () => {
      const createUserDto = {
        name: 'Security Test User',
        email: 'security@example.com',
        password: 'mySecurePassword123',
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const userRepository = app.get('UserRepository') || app.get('getRepository');
      const user = await userRepository.findOne({ where: { id: response.body.id } });

      expect(user.password).not.toBe(createUserDto.password);

      const isPasswordValid = await compare(createUserDto.password, user.password);
      expect(isPasswordValid).toBe(true);
    });
  });

  describe('GET /users', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('email');
          expect(res.body[0]).toHaveProperty('isActive');
          expect(res.body[0]).toHaveProperty('createdAt');
          expect(res.body[0]).toHaveProperty('updatedAt');
          // Password should not be returned
          expect(res.body[0]).not.toHaveProperty('password');
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdUserId);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('isActive');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          // Password should not be returned
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = 'non-existent-id';
      return request(app.getHttpServer()).get(`/users/${nonExistentId}`).expect(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user successfully', () => {
      const updateUserDto = {
        name: 'João Silva Updated',
        email: 'joao.updated@example.com',
        password: 'newpassword123',
        isActive: false,
      };

      return request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdUserId);
          expect(res.body.name).toBe(updateUserDto.name);
          expect(res.body.email).toBe(updateUserDto.email);
          expect(res.body.isActive).toBe(updateUserDto.isActive);
          // Password should not be returned
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should update user with partial data', () => {
      const partialUpdateDto = {
        name: 'João Silva Partial Update',
      };

      return request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send(partialUpdateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdUserId);
          expect(res.body.name).toBe(partialUpdateDto.name);
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('isActive');
        });
    });

    it('should hash password correctly when updating user', async () => {
      const updateUserDto = {
        password: 'newSecurePassword456',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send(updateUserDto)
        .expect(200);

      const userRepository = app.get('UserRepository') || app.get('getRepository');
      const user = await userRepository.findOne({ where: { id: response.body.id } });

      expect(user.password).not.toBe(updateUserDto.password);

      const isPasswordValid = await compare(updateUserDto.password, user.password);
      expect(isPasswordValid).toBe(true);
    });

    it('should return 404 when updating non-existent user', () => {
      const nonExistentId = 'non-existent-id';
      const updateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      return request(app.getHttpServer())
        .put(`/users/${nonExistentId}`)
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user successfully', () => {
      return request(app.getHttpServer()).delete(`/users/${createdUserId}`).expect(204);
    });

    it('should return 404 when deleting non-existent user', () => {
      const nonExistentId = 'non-existent-id';
      return request(app.getHttpServer()).delete(`/users/${nonExistentId}`).expect(404);
    });
  });

  describe('User lifecycle', () => {
    it('should complete full user lifecycle: create, read, update, delete', async () => {
      const createUserDto = {
        name: 'Lifecycle Test User',
        email: 'lifecycle@example.com',
        password: 'password123',
        isActive: true,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const userId = createResponse.body.id;
      expect(createResponse.body.name).toBe(createUserDto.name);
      expect(createResponse.body.email).toBe(createUserDto.email);

      const readResponse = await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);

      expect(readResponse.body.id).toBe(userId);
      expect(readResponse.body.name).toBe(createUserDto.name);
      expect(readResponse.body.email).toBe(createUserDto.email);

      const updateUserDto = {
        name: 'Updated Lifecycle User',
        email: 'updated.lifecycle@example.com',
        isActive: false,
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateUserDto)
        .expect(200);

      expect(updateResponse.body.name).toBe(updateUserDto.name);
      expect(updateResponse.body.email).toBe(updateUserDto.email);
      expect(updateResponse.body.isActive).toBe(updateUserDto.isActive);

      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);

      await request(app.getHttpServer()).get(`/users/${userId}`).expect(404);
    });
  });
});
