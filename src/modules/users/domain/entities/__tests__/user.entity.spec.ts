import { User } from '../../user.entity';

describe('User Entity', () => {
  const validUserData = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'password123',
  };

  describe('Creation', () => {
    it('should create a user with valid data', () => {
      const user = User.create(validUserData);

      expect(user.name.value).toBe('João Silva');
      expect(user.email.value).toBe('joao@example.com');
      expect(user.password.value).toBe('password123');
      expect(user.status.isActive).toBe(true);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with inactive status', () => {
      const user = User.create({
        ...validUserData,
        status: false,
      });

      expect(user.status.isActive).toBe(false);
    });

    it('should restore a user with all data', () => {
      const user = User.restore({
        id: '12345678-1234-1234-1234-123456789012',
        ...validUserData,
        status: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });

      expect(user.id?.value).toBe('12345678-1234-1234-1234-123456789012');
      expect(user.createdAt).toEqual(new Date('2023-01-01'));
      expect(user.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should throw error for invalid name', () => {
      expect(() =>
        User.create({
          ...validUserData,
          name: '',
        }),
      ).toThrow('User name cannot be empty');
    });

    it('should throw error for invalid email', () => {
      expect(() =>
        User.create({
          ...validUserData,
          email: 'invalid-email',
        }),
      ).toThrow('Invalid email format');
    });

    it('should throw error for invalid password', () => {
      expect(() =>
        User.create({
          ...validUserData,
          password: '123',
        }),
      ).toThrow('Password must have at least 6 characters');
    });
  });

  describe('Business Methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.create(validUserData);
    });

    it('should update name', () => {
      user.updateName('Maria Santos');
      expect(user.name.value).toBe('Maria Santos');
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update email', () => {
      user.updateEmail('maria@example.com');
      expect(user.email.value).toBe('maria@example.com');
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update password', () => {
      user.updatePassword('newpassword123');
      expect(user.password.value).toBe('newpassword123');
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should activate user', () => {
      user.deactivate();
      expect(user.status.isInactive).toBe(true);

      user.activate();
      expect(user.status.isActive).toBe(true);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should deactivate user', () => {
      user.deactivate();
      expect(user.status.isInactive).toBe(true);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should check if can be updated', () => {
      expect(user.canBeUpdated()).toBe(true);

      user.deactivate();
      expect(() => user.canBeUpdated()).toThrow('Cannot update an inactive user');
    });

    it('should check if can be deleted', () => {
      expect(user.canBeDeleted()).toBe(true);

      user.deactivate();
      expect(() => user.canBeDeleted()).toThrow('Cannot delete an inactive user');
    });
  });

  describe('Validation', () => {
    it('should throw error when updating name with invalid value', () => {
      const user = User.create(validUserData);

      expect(() => user.updateName('')).toThrow('User name cannot be empty');
    });

    it('should throw error when updating email with invalid value', () => {
      const user = User.create(validUserData);

      expect(() => user.updateEmail('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error when updating password with invalid value', () => {
      const user = User.create(validUserData);

      expect(() => user.updatePassword('123')).toThrow('Password must have at least 6 characters');
    });
  });
});
