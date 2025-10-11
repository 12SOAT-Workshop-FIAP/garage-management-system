export abstract class CryptographyPort {
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
