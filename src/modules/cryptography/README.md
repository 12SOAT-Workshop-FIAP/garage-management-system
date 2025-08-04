# Cryptography Module

This module provides secure handling of sensitive data for developers. It's designed as a utility library that can be imported by other modules to handle sensitive data like CPF, CNPJ, and license plates securely.

## Features

- **Secure Encryption/Decryption**: All sensitive data is encrypted before storage and decrypted when needed
- **Data Validation**: Built-in validation for CPF, CNPJ, and Brazilian license plates
- **Value Objects**: Rich domain objects with formatting and masking capabilities
- **Developer-Friendly**: Easy to integrate into other modules

## Supported Data Types

- **CPF**: Brazilian individual taxpayer registration
- **CNPJ**: Brazilian corporate taxpayer registration  
- **License Plates**: Brazilian vehicle license plates (both old and Mercosul formats)

## Usage

### 1. Import the Module

```typescript
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [CryptographyModule],
  // ... other module configuration
})
export class YourModule {}
```

### 2. Inject the Service

```typescript
import { CryptographyService } from '../cryptography/application/services/cryptography.service';

@Injectable()
export class YourService {
  constructor(
    private readonly cryptographyService: CryptographyService,
  ) {}
}
```

### 3. Use the Service

#### Encrypting Sensitive Data

```typescript
// Encrypt CPF
const cpfValueObject = await this.cryptographyService.encryptSensitiveData('12345678901', 'cpf');
const encryptedCPF = cpfValueObject.encryptedValue;

// Encrypt CNPJ
const cnpjValueObject = await this.cryptographyService.encryptSensitiveData('12345678000195', 'cnpj');
const encryptedCNPJ = cnpjValueObject.encryptedValue;

// Encrypt License Plate
const plateValueObject = await this.cryptographyService.encryptSensitiveData('ABC1234', 'license-plate');
const encryptedPlate = plateValueObject.encryptedValue;
```

#### Decrypting Sensitive Data

```typescript
// Decrypt CPF
const cpfValueObject = await this.cryptographyService.decryptSensitiveData(encryptedCPF, 'cpf');
const originalCPF = cpfValueObject.value;

// Decrypt CNPJ
const cnpjValueObject = await this.cryptographyService.decryptSensitiveData(encryptedCNPJ, 'cnpj');
const originalCNPJ = cnpjValueObject.value;
```

#### Validating Data

```typescript
// Validate CPF format
const isValidCPF = this.cryptographyService.validateSensitiveData('12345678901', 'cpf');

// Validate CNPJ format
const isValidCNPJ = this.cryptographyService.validateSensitiveData('12345678000195', 'cnpj');

// Validate License Plate
const isValidPlate = this.cryptographyService.validateSensitiveData('ABC1234', 'license-plate');
```

#### Using Value Objects

```typescript
// Get formatted values
const formattedCPF = cpfValueObject.getFormattedValue(); // "123.456.789-01"
const formattedCNPJ = cnpjValueObject.getFormattedValue(); // "12.345.678/0001-95"

// Get masked values for display
const maskedCPF = cpfValueObject.getMaskedValue(); // "***.***.***-01"
const maskedCNPJ = cnpjValueObject.getMaskedValue(); // "**.***.***/****-95"

// Get license plate type
const plateType = plateValueObject.getPlateType(); // "old" or "mercosul"
```

## Complete Example

Here's how to use the cryptography service in a customer creation scenario:

```typescript
@Injectable()
export class CreateCustomerService {
  constructor(
    private readonly cryptographyService: CryptographyService,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(dto: CreateCustomerDto) {
    // Validate and encrypt CPF if provided
    let encryptedCPF: string | undefined;
    
    if (dto.cpf) {
      if (!this.cryptographyService.validateSensitiveData(dto.cpf, 'cpf')) {
        throw new BadRequestException('Invalid CPF format');
      }
      
      const cpfValueObject = await this.cryptographyService.encryptSensitiveData(dto.cpf, 'cpf');
      encryptedCPF = cpfValueObject.encryptedValue;
    }

    // Create customer with encrypted data
    const customer = await this.customerRepository.create({
      name: dto.name,
      cpf: encryptedCPF,
    });

    return customer;
  }
}
```

## Security Notes

- All sensitive data is encrypted before storage
- Validation is performed before encryption
- Value objects provide safe formatting and masking
- The service throws descriptive errors for invalid data
- No sensitive data is logged or exposed in error messages

## Architecture

The module follows Clean Architecture principles:

- **Domain**: Value objects (CPF, CNPJ, LicensePlate) and repository interface
- **Application**: CryptographyService orchestrates operations
- **Infrastructure**: CryptoRepository implements actual encryption/decryption
- **No Presentation Layer**: This is a utility module