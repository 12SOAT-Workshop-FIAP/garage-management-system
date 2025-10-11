import { CryptographyAdapter } from '../cryptography.adapter';
import { hash, compare } from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('CryptographyAdapter', () => {
  let adapter: CryptographyAdapter;

  beforeEach(() => {
    adapter = new CryptographyAdapter();
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      (hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await adapter.hashPassword(password);

      expect(hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle hash errors', async () => {
      const password = 'password123';
      const error = new Error('Hash failed');

      (hash as jest.Mock).mockRejectedValue(error);

      await expect(adapter.hashPassword(password)).rejects.toThrow('Hash failed');
      expect(hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePassword', () => {
    it('should compare password successfully when passwords match', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      (compare as jest.Mock).mockResolvedValue(true);

      const result = await adapter.comparePassword(password, hashedPassword);

      expect(compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should compare password successfully when passwords do not match', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      (compare as jest.Mock).mockResolvedValue(false);

      const result = await adapter.comparePassword(password, hashedPassword);

      expect(compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle compare errors', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';
      const error = new Error('Compare failed');

      (compare as jest.Mock).mockRejectedValue(error);

      await expect(adapter.comparePassword(password, hashedPassword)).rejects.toThrow(
        'Compare failed',
      );
      expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
