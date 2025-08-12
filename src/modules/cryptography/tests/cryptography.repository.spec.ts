import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyRepository } from '../infrastructure/repositories/cryptography.repository';
import { ICryptographyRepository } from '../domain/cryptography.repository';

describe('CryptoRepository', () => {
  let repository: CryptographyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyRepository],
    }).compile();

    repository = module.get<CryptographyRepository>(CryptographyRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt data successfully', async () => {
      const data = 'test-data';
      const result = await repository.encrypt(data);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain(':');

      // Verify the result can be decrypted back to original
      const decrypted = await repository.decrypt(result);
      expect(decrypted).toBe(data);
    });

    it('should encrypt different data with different results', async () => {
      const data1 = 'test-data-1';
      const data2 = 'test-data-2';

      const result1 = await repository.encrypt(data1);
      const result2 = await repository.encrypt(data2);

      expect(result1).not.toBe(result2);
    });

    it('should encrypt same data with same results (deterministic IV)', async () => {
      const data = 'test-data';

      const result1 = await repository.encrypt(data);
      const result2 = await repository.encrypt(data);

      expect(result1).toBe(result2);

      // Both should decrypt to the same original data
      const decrypted1 = await repository.decrypt(result1);
      const decrypted2 = await repository.decrypt(result2);
      expect(decrypted1).toBe(data);
      expect(decrypted2).toBe(data);
    });

    it('should handle empty string', async () => {
      const data = '';
      const result = await repository.encrypt(data);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');

      const decrypted = await repository.decrypt(result);
      expect(decrypted).toBe(data);
    });

    it('should handle special characters', async () => {
      const data = 'test-data-with-special-chars:!@#$%^&*()';
      const result = await repository.encrypt(data);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');

      const decrypted = await repository.decrypt(result);
      expect(decrypted).toBe(data);
    });
  });

  describe('decrypt', () => {
    it('should decrypt data successfully', async () => {
      const originalData = 'test-data';
      const encrypted = await repository.encrypt(originalData);
      const decrypted = await repository.decrypt(encrypted);

      expect(decrypted).toBe(originalData);
    });

    it('should handle empty encrypted data', async () => {
      const originalData = '';
      const encrypted = await repository.encrypt(originalData);
      const decrypted = await repository.decrypt(encrypted);

      expect(decrypted).toBe(originalData);
    });

    it('should handle long data', async () => {
      const originalData = 'a'.repeat(1000);
      const encrypted = await repository.encrypt(originalData);
      const decrypted = await repository.decrypt(encrypted);

      expect(decrypted).toBe(originalData);
    });

    it('should handle unicode characters', async () => {
      const originalData = 'test-data-with-unicode-éñç';
      const encrypted = await repository.encrypt(originalData);
      const decrypted = await repository.decrypt(encrypted);

      expect(decrypted).toBe(originalData);
    });
  });

  describe('hash', () => {
    it('should create hash successfully', async () => {
      const data = 'test-data';
      const hash = await repository.hash(data);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA-256 produces 64 character hex string
    });

    it('should create consistent hash for same data', async () => {
      const data = 'test-data';
      const hash1 = await repository.hash(data);
      const hash2 = await repository.hash(data);

      expect(hash1).toBe(hash2);
    });

    it('should create different hashes for different data', async () => {
      const data1 = 'test-data-1';
      const data2 = 'test-data-2';

      const hash1 = await repository.hash(data1);
      const hash2 = await repository.hash(data2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', async () => {
      const data = '';
      const hash = await repository.hash(data);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });

    it('should handle special characters', async () => {
      const data = 'test-data-with-special-chars:!@#$%^&*()';
      const hash = await repository.hash(data);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });
  });

  describe('verifyHash', () => {
    it('should verify matching hash correctly', async () => {
      const data = 'test-data';
      const hash = await repository.hash(data);
      const result = await repository.verifyHash(data, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching hash', async () => {
      const data = 'test-data';
      const wrongHash = 'a'.repeat(64); // Wrong hash with correct length
      const result = await repository.verifyHash(data, wrongHash);

      expect(result).toBe(false);
    });

    it('should return false for different data with same hash', async () => {
      const data1 = 'test-data-1';
      const data2 = 'test-data-2';
      const hash1 = await repository.hash(data1);
      const result = await repository.verifyHash(data2, hash1);

      expect(result).toBe(false);
    });

    it('should handle empty string', async () => {
      const data = '';
      const hash = await repository.hash(data);
      const result = await repository.verifyHash(data, hash);

      expect(result).toBe(true);
    });

    it('should handle special characters', async () => {
      const data = 'test-data-with-special-chars:!@#$%^&*()';
      const hash = await repository.hash(data);
      const result = await repository.verifyHash(data, hash);

      expect(result).toBe(true);
    });

    it('should return false for completely wrong hash with different length', async () => {
      const data = 'test-data';
      const wrongHash = 'wrong-hash'; // Wrong hash with different length
      const result = await repository.verifyHash(data, wrongHash);

      expect(result).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should encrypt and decrypt complex data', async () => {
      const originalData = 'complex-data-with-unicode-éñç-and-special-chars:!@#$%^&*()';
      const encrypted = await repository.encrypt(originalData);
      const decrypted = await repository.decrypt(encrypted);

      expect(decrypted).toBe(originalData);
    });

    it('should hash and verify complex data', async () => {
      const originalData = 'complex-data-with-unicode-éñç-and-special-chars:!@#$%^&*()';
      const hash = await repository.hash(originalData);
      const result = await repository.verifyHash(originalData, hash);

      expect(result).toBe(true);
    });

    it('should handle very long data', async () => {
      const originalData = 'a'.repeat(10000);
      const encrypted = await repository.encrypt(originalData);
      const decrypted = await repository.decrypt(encrypted);

      expect(decrypted).toBe(originalData);
    });
  });
});
