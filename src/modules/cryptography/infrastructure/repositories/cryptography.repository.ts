import { Injectable } from '@nestjs/common';
import { ICryptographyRepository } from '../../domain/cryptography.repository';
import * as crypto from 'crypto';

/**
 * Cryptography Repository Implementation
 * Concrete implementation of cryptography operations.
 */
@Injectable()
export class CryptographyRepository implements ICryptographyRepository {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey = process.env.CRYPTO_SECRET_KEY || 'your-secret-key-32-chars-long!!';
  private readonly ivLength = 16;

  /**
   * Encrypts data using AES-256-CBC with deterministic IV
   * @param data - The data to encrypt
   * @returns Promise<string> - The encrypted data
   */
  async encrypt(data: string): Promise<string> {
    // Generate deterministic IV based on data hash (first 16 bytes)
    const hash = crypto.createHash('sha256').update(data + this.secretKey).digest();
    const iv = hash.subarray(0, this.ivLength);
    
    const key = crypto.scryptSync(this.secretKey, 'salt', 32);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypts data using AES-256-CBC
   * @param encryptedData - The encrypted data to decrypt
   * @returns Promise<string> - The decrypted data
   */
  async decrypt(encryptedData: string): Promise<string> {
    const textParts = encryptedData.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = textParts.join(':');
    const key = crypto.scryptSync(this.secretKey, 'salt', 32);

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Creates a SHA-256 hash of the data
   * @param data - The data to hash
   * @returns Promise<string> - The hashed data
   */
  async hash(data: string): Promise<string> {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verifies if data matches a hash using timing-safe comparison
   * @param data - The data to verify
   * @param hash - The hash to compare against
   * @returns Promise<boolean> - True if data matches hash
   */
  async verifyHash(data: string, hash: string): Promise<boolean> {
    const dataHash = await this.hash(data);

    // Check if lengths match first to avoid timingSafeEqual error
    if (dataHash.length !== hash.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(dataHash), Buffer.from(hash));
  }
}
