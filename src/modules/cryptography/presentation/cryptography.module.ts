import { Module } from '@nestjs/common';
import { CryptographyService } from '../application/services/cryptography.service';
import { ICryptographyRepository } from '../domain/cryptography.repository';
import { CryptographyRepository } from '../infrastructure/repositories/cryptography.repository';

/**
 * Cryptography Module
 *
 * This module provides secure handling of sensitive data for developers.
 * It exports the CryptographyService which can be imported by other modules
 * to handle sensitive data like CPF, CNPJ, and license plates securely.
 *
 * Usage in other modules:
 * ```typescript
 * import { CryptographyModule } from '../cryptography/cryptography.module';
 *
 * @Module({
 *   imports: [CryptographyModule],
 *   // ... other module configuration
 * })
 * export class CustomerModule {}
 * ```
 */
@Module({
  providers: [
    CryptographyService,
    {
      provide: ICryptographyRepository,
      useClass: CryptographyRepository,
    },
  ],
  exports: [CryptographyService],
})
export class CryptographyModule {}
