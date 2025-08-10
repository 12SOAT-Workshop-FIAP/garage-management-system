/**
 * Cryptography Repository Interface
 * Defines the contract for cryptography operations in the domain layer.
 *
 * This interface follows the Dependency Inversion Principle (DIP) from SOLID,
 * ensuring that the domain layer doesn't depend on concrete implementations.
 */
export abstract class ICryptographyRepository {
  /**
   * Encrypts sensitive data using a secure algorithm
   * @param data - The data to be encrypted
   * @returns Promise<string> - The encrypted data
   */
  abstract encrypt(data: string): Promise<string>;

  /**
   * Decrypts encrypted data
   * @param encryptedData - The encrypted data to be decrypted
   * @returns Promise<string> - The decrypted data
   */
  abstract decrypt(encryptedData: string): Promise<string>;

  /**
   * Creates a one-way hash of the data
   * @param data - The data to be hashed
   * @returns Promise<string> - The hashed data
   */
  abstract hash(data: string): Promise<string>;

  /**
   * Verifies if a data matches a hash using timing-safe comparison
   * @param data - The data to verify
   * @param hash - The hash to compare against
   * @returns Promise<boolean> - True if data matches hash
   */
  abstract verifyHash(data: string, hash: string): Promise<boolean>;
}

