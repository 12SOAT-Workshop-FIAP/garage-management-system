# Hexagonal Architecture Migration - Customer Module

## Overview

This document demonstrates the migration of the Customer module from a traditional layered architecture to a pure Hexagonal Architecture (Ports & Adapters), following the latest industry best practices.

## Table of Contents

1. [Architecture Comparison](#architecture-comparison)
2. [Migration Process](#migration-process)
3. [Domain Layer](#domain-layer)
4. [Application Layer](#application-layer)
5. [Infrastructure Layer](#infrastructure-layer)
6. [Benefits Achieved](#benefits-achieved)
7. [Data Flow Diagrams](#data-flow-diagrams)

## Architecture Comparison

### Before: Traditional Layered Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        Controller[CustomerController]
        DTOs[DTOs]
    end
    
    subgraph "Application Layer"
        Services[Customer Services]
        AppDTOs[Application DTOs]
    end
    
    subgraph "Domain Layer"
        Entity[Customer Entity]
        Repository[Repository Interface]
    end
    
    subgraph "Infrastructure Layer"
        TypeORM[TypeORM Repository]
        Database[(Database)]
    end
    
    Controller --> Services
    Services --> AppDTOs
    Services --> Entity
    Services --> Repository
    Repository --> TypeORM
    TypeORM --> Database
    
    style Controller fill:#ffcccc
    style Services fill:#ffcccc
    style Entity fill:#ffcccc
    style TypeORM fill:#ffcccc
```

**Problems with Traditional Architecture:**
- ❌ Controllers contain business logic
- ❌ Services depend on DTOs from application layer
- ❌ Domain entities are anemic (data containers)
- ❌ Tight coupling between layers
- ❌ Difficult to test and maintain

### After: Hexagonal Architecture

```mermaid
graph TB
    subgraph "Domain Layer (Core)"
        Entity[Customer Entity]
        VOs[Value Objects]
        Ports[Ports/Interfaces]
    end
    
    subgraph "Application Layer"
        Commands[Commands]
        Queries[Queries]
        UseCases[Use Cases]
    end
    
    subgraph "Infrastructure Layer (Adapters)"
        HTTPAdapter[HTTP Adapter]
        DBAdapter[Database Adapter]
        CryptoAdapter[Cryptography Adapter]
        Mappers[Mappers]
    end
    
    subgraph "External Systems"
        Database[(Database)]
        CryptoService[Cryptography Service]
        HTTP[HTTP Requests]
    end
    
    UseCases --> Entity
    UseCases --> VOs
    UseCases --> Ports
    
    HTTPAdapter --> UseCases
    DBAdapter --> Ports
    CryptoAdapter --> Ports
    
    HTTP --> HTTPAdapter
    DBAdapter --> Database
    CryptoAdapter --> CryptoService
    
    style Entity fill:#90EE90
    style VOs fill:#90EE90
    style Ports fill:#90EE90
    style UseCases fill:#87CEEB
    style HTTPAdapter fill:#FFB6C1
    style DBAdapter fill:#FFB6C1
    style CryptoAdapter fill:#FFB6C1
```

**Benefits of Hexagonal Architecture:**
- ✅ Domain is the center of the application
- ✅ All dependencies point inward to the domain
- ✅ Easy to test with mocks of ports
- ✅ Easy to swap implementations
- ✅ Rich domain model with business logic

## Migration Process

### Step 1: Domain Layer Refactoring

```mermaid
graph LR
    subgraph "Before"
        A[Simple Customer Entity]
        B[No Validation]
        C[Anemic Model]
    end
    
    subgraph "After"
        D[Rich Customer Entity]
        E[Value Objects]
        F[Business Rules]
        G[Domain Validation]
    end
    
    A --> D
    B --> E
    C --> F
    C --> G
    
    style A fill:#ffcccc
    style B fill:#ffcccc
    style C fill:#ffcccc
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
```

### Step 2: Application Layer Transformation

```mermaid
graph TB
    subgraph "Before: Services"
        CreateService[CreateCustomerService]
        UpdateService[UpdateCustomerService]
        FindService[FindCustomerService]
        DeleteService[DeleteCustomerService]
    end
    
    subgraph "After: CQRS Pattern"
        subgraph "Commands"
            CreateCmd[CreateCustomerCommand]
            UpdateCmd[UpdateCustomerCommand]
            DeleteCmd[DeleteCustomerCommand]
        end
        
        subgraph "Queries"
            FindByIdQuery[FindCustomerByIdQuery]
            FindByDocQuery[FindCustomerByDocumentQuery]
            FindAllQuery[FindAllCustomersQuery]
        end
        
        subgraph "Use Cases"
            CreateUC[CreateCustomerUseCase]
            UpdateUC[UpdateCustomerUseCase]
            DeleteUC[DeleteCustomerUseCase]
            FindByIdUC[FindCustomerByIdUseCase]
            FindByDocUC[FindCustomerByDocumentUseCase]
            FindAllUC[FindAllCustomersUseCase]
        end
    end
    
    CreateService --> CreateCmd
    UpdateService --> UpdateCmd
    FindService --> FindByIdQuery
    FindService --> FindByDocQuery
    FindService --> FindAllQuery
    DeleteService --> DeleteCmd
    
    CreateCmd --> CreateUC
    UpdateCmd --> UpdateUC
    DeleteCmd --> DeleteUC
    FindByIdQuery --> FindByIdUC
    FindByDocQuery --> FindByDocUC
    FindAllQuery --> FindAllUC
    
    style CreateService fill:#ffcccc
    style UpdateService fill:#ffcccc
    style FindService fill:#ffcccc
    style DeleteService fill:#ffcccc
    style CreateUC fill:#87CEEB
    style UpdateUC fill:#87CEEB
    style DeleteUC fill:#87CEEB
    style FindByIdUC fill:#87CEEB
    style FindByDocUC fill:#87CEEB
    style FindAllUC fill:#87CEEB
```

### Step 3: Infrastructure Layer Implementation

```mermaid
graph TB
    subgraph "Before: Direct Dependencies"
        Controller[CustomerController]
        Service[CustomerService]
        Repository[CustomerRepository]
        TypeORM[TypeORM Implementation]
    end
    
    subgraph "After: Ports & Adapters"
        subgraph "Ports (Interfaces)"
            CustomerPort[CustomerRepository Port]
            CryptoPort[Cryptography Port]
        end
        
        subgraph "Adapters (Implementations)"
            HTTPAdapter[CustomerHttpAdapter]
            DBAdapter[CustomerTypeOrmRepository]
            CryptoAdapter[CryptographyAdapter]
            Mapper[CustomerMapper]
        end
    end
    
    Controller --> Service
    Service --> Repository
    Repository --> TypeORM
    
    HTTPAdapter --> CustomerPort
    HTTPAdapter --> CryptoPort
    DBAdapter --> CustomerPort
    CryptoAdapter --> CryptoPort
    
    style Controller fill:#ffcccc
    style Service fill:#ffcccc
    style Repository fill:#ffcccc
    style TypeORM fill:#ffcccc
    style CustomerPort fill:#90EE90
    style CryptoPort fill:#90EE90
    style HTTPAdapter fill:#FFB6C1
    style DBAdapter fill:#FFB6C1
    style CryptoAdapter fill:#FFB6C1
```

## Domain Layer

### Value Objects

```mermaid
classDiagram
    class CustomerId {
        -value: number
        +constructor(value: number)
        +getValue(): number
        +equals(other: CustomerId): boolean
        +toString(): string
    }
    
    class CustomerName {
        -value: string
        +constructor(value: string)
        +getValue(): string
        +equals(other: CustomerName): boolean
        +toString(): string
    }
    
    class Document {
        -value: string
        -type: 'cpf' | 'cnpj'
        +constructor(value: string)
        +getValue(): string
        +getType(): 'cpf' | 'cnpj'
        +isCPF(): boolean
        +isCNPJ(): boolean
        +getFormatted(): string
        +getMasked(): string
        +equals(other: Document): boolean
    }
    
    class Email {
        -value: string
        +constructor(value: string)
        +getValue(): string
        +equals(other: Email): boolean
        +toString(): string
    }
    
    class Phone {
        -value: string
        +constructor(value: string)
        +getValue(): string
        +getFormatted(): string
        +equals(other: Phone): boolean
        +toString(): string
    }
    
    class PersonType {
        -value: PersonTypeEnum
        +constructor(value: PersonTypeEnum)
        +getValue(): PersonTypeEnum
        +isIndividual(): boolean
        +isCompany(): boolean
        +equals(other: PersonType): boolean
    }
    
    class CustomerStatus {
        -value: boolean
        +constructor(value: boolean)
        +getValue(): boolean
        +isActive(): boolean
        +isInactive(): boolean
        +activate(): CustomerStatus
        +deactivate(): CustomerStatus
        +equals(other: CustomerStatus): boolean
    }
    
    class PersonTypeEnum {
        <<enumeration>>
        INDIVIDUAL
        COMPANY
    }
    
    PersonType --> PersonTypeEnum
```

### Rich Domain Entity

```mermaid
classDiagram
    class Customer {
        -id: CustomerId
        -name: CustomerName
        -personType: PersonType
        -document: Document
        -email: Email
        -phone: Phone
        -status: CustomerStatus
        -vehicleIds: number[]
        -createdAt: Date
        -updatedAt: Date
        
        +constructor(props)
        +getId(): CustomerId
        +getName(): CustomerName
        +getPersonType(): PersonType
        +getDocument(): Document
        +getEmail(): Email
        +getPhone(): Phone
        +getStatus(): CustomerStatus
        +getVehicleIds(): number[]
        +getCreatedAt(): Date
        +getUpdatedAt(): Date
        
        +updateName(name: string): void
        +updateEmail(email: string): void
        +updatePhone(phone: string): void
        +updateDocument(document: string): void
        +activate(): void
        +deactivate(): void
        +addVehicle(vehicleId: number): void
        +removeVehicle(vehicleId: number): void
        +getBusinessKey(): string
        +canBeDeleted(): boolean
        +canBeUpdated(): boolean
        
        -validateDocumentType(document: Document, personType: PersonType): void
        
        +create(props): Customer
        +restore(props): Customer
    }
    
    class CustomerId {
        -value: number
    }
    
    class CustomerName {
        -value: string
    }
    
    class PersonType {
        -value: PersonTypeEnum
    }
    
    class Document {
        -value: string
        -type: 'cpf' | 'cnpj'
    }
    
    class Email {
        -value: string
    }
    
    class Phone {
        -value: string
    }
    
    class CustomerStatus {
        -value: boolean
    }
    
    Customer --> CustomerId
    Customer --> CustomerName
    Customer --> PersonType
    Customer --> Document
    Customer --> Email
    Customer --> Phone
    Customer --> CustomerStatus
```

## Application Layer

### CQRS Pattern Implementation

```mermaid
graph TB
    subgraph "Commands (Write Operations)"
        CreateCmd[CreateCustomerCommand]
        UpdateCmd[UpdateCustomerCommand]
        DeleteCmd[DeleteCustomerCommand]
    end
    
    subgraph "Queries (Read Operations)"
        FindByIdQuery[FindCustomerByIdQuery]
        FindByDocQuery[FindCustomerByDocumentQuery]
        FindAllQuery[FindAllCustomersQuery]
    end
    
    subgraph "Use Cases (Handlers)"
        CreateUC[CreateCustomerUseCase]
        UpdateUC[UpdateCustomerUseCase]
        DeleteUC[DeleteCustomerUseCase]
        FindByIdUC[FindCustomerByIdUseCase]
        FindByDocUC[FindCustomerByDocumentUseCase]
        FindAllUC[FindAllCustomersUseCase]
    end
    
    subgraph "Domain Layer"
        Customer[Customer Entity]
        Repository[CustomerRepository Port]
        CryptoPort[Cryptography Port]
    end
    
    CreateCmd --> CreateUC
    UpdateCmd --> UpdateUC
    DeleteCmd --> DeleteUC
    FindByIdQuery --> FindByIdUC
    FindByDocQuery --> FindByDocUC
    FindAllQuery --> FindAllUC
    
    CreateUC --> Customer
    CreateUC --> Repository
    CreateUC --> CryptoPort
    
    UpdateUC --> Customer
    UpdateUC --> Repository
    UpdateUC --> CryptoPort
    
    DeleteUC --> Customer
    DeleteUC --> Repository
    
    FindByIdUC --> Repository
    FindByIdUC --> CryptoPort
    
    FindByDocUC --> Repository
    FindByDocUC --> CryptoPort
    
    FindAllUC --> Repository
    FindAllUC --> CryptoPort
    
    style CreateCmd fill:#87CEEB
    style UpdateCmd fill:#87CEEB
    style DeleteCmd fill:#87CEEB
    style FindByIdQuery fill:#87CEEB
    style FindByDocQuery fill:#87CEEB
    style FindAllQuery fill:#87CEEB
    style Customer fill:#90EE90
    style Repository fill:#90EE90
    style CryptoPort fill:#90EE90
```

## Infrastructure Layer

### Ports & Adapters Pattern

```mermaid
graph TB
    subgraph "Domain Layer (Ports)"
        CustomerRepoPort[CustomerRepository Port]
        CryptoPort[Cryptography Port]
    end
    
    subgraph "Infrastructure Layer (Adapters)"
        HTTPAdapter[CustomerHttpAdapter]
        DBAdapter[CustomerTypeOrmRepository]
        CryptoAdapter[CryptographyAdapter]
        Mapper[CustomerMapper]
    end
    
    subgraph "External Systems"
        Database[(PostgreSQL)]
        CryptoService[Cryptography Service]
        HTTP[HTTP Requests/Responses]
    end
    
    HTTPAdapter --> CustomerRepoPort
    HTTPAdapter --> CryptoPort
    
    DBAdapter --> CustomerRepoPort
    DBAdapter --> Mapper
    Mapper --> Database
    
    CryptoAdapter --> CryptoPort
    CryptoAdapter --> CryptoService
    
    HTTP --> HTTPAdapter
    
    style CustomerRepoPort fill:#90EE90
    style CryptoPort fill:#90EE90
    style HTTPAdapter fill:#FFB6C1
    style DBAdapter fill:#FFB6C1
    style CryptoAdapter fill:#FFB6C1
    style Mapper fill:#FFB6C1
```

## Benefits Achieved

### Maintainability

```mermaid
graph LR
    subgraph "Before"
        A[Tight Coupling]
        B[Scattered Logic]
        C[Hard to Change]
    end
    
    subgraph "After"
        D[Loose Coupling]
        E[Centralized Logic]
        F[Easy to Change]
    end
    
    A --> D
    B --> E
    C --> F
    
    style A fill:#ffcccc
    style B fill:#ffcccc
    style C fill:#ffcccc
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
```

### Testability

```mermaid
graph TB
    subgraph "Before: Hard to Test"
        A[Integration Tests Only]
        B[Database Dependencies]
        C[External Service Dependencies]
    end
    
    subgraph "After: Easy to Test"
        D[Unit Tests for Each Layer]
        E[Mock Ports]
        F[Isolated Testing]
    end
    
    A --> D
    B --> E
    C --> F
    
    style A fill:#ffcccc
    style B fill:#ffcccc
    style C fill:#ffcccc
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
```

### Flexibility

```mermaid
graph TB
    subgraph "Easy to Swap Implementations"
        A[Database: TypeORM → Prisma]
        B[HTTP: REST → GraphQL]
        C[Crypto: Service A → Service B]
    end
    
    subgraph "Easy to Add New Features"
        D[New Use Cases]
        E[New Adapters]
        F[New Ports]
    end
    
    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
```

## Data Flow Diagrams

### Customer Creation Flow

```mermaid
sequenceDiagram
    participant HTTP as HTTP Adapter
    participant UC as CreateCustomerUseCase
    participant Customer as Customer Entity
    participant Crypto as Cryptography Port
    participant Repo as Customer Repository
    participant DB as Database
    
    HTTP->>UC: CreateCustomerCommand
    UC->>Customer: Customer.create(props)
    Customer->>Customer: Validate business rules
    Customer-->>UC: Customer instance
    
    UC->>Crypto: encryptSensitiveData(document)
    Crypto-->>UC: Encrypted document
    
    UC->>Customer: Customer.restore(with encrypted doc)
    Customer-->>UC: Customer with encrypted data
    
    UC->>Repo: create(customer)
    Repo->>DB: INSERT INTO customers
    DB-->>Repo: Customer record
    Repo-->>UC: Customer entity
    
    UC-->>HTTP: Customer entity
    HTTP->>HTTP: Convert to DTO
    HTTP-->>HTTP: HTTP Response
```

### Customer Retrieval Flow

```mermaid
sequenceDiagram
    participant HTTP as HTTP Adapter
    participant UC as FindCustomerByIdUseCase
    participant Repo as Customer Repository
    participant Crypto as Cryptography Port
    participant DB as Database
    
    HTTP->>UC: FindCustomerByIdQuery
    UC->>Repo: findById(id)
    Repo->>DB: SELECT * FROM customers WHERE id = ?
    DB-->>Repo: Customer record
    Repo-->>UC: Customer entity (encrypted)
    
    UC->>Crypto: decryptSensitiveData(document)
    Crypto-->>UC: Decrypted document
    
    UC->>UC: Customer.restore(with decrypted data)
    UC-->>HTTP: Customer entity (decrypted)
    HTTP->>HTTP: Convert to DTO
    HTTP-->>HTTP: HTTP Response
```

### Cross-Module Dependencies Resolution

```mermaid
graph TB
    subgraph "Before - Cross-Module Dependencies"
        A[Customer Entity]
        B[Vehicle Entity]
        A -->|Direct Import| B
        style A fill:#ffcccc
        style B fill:#ffcccc
    end
    
    subgraph "After - ID References"
        C[Customer Entity]
        D[Vehicle IDs Array]
        E[Vehicle Entity]
        C -->|"vehicleIds: number[]"| D
        C -.->|No Direct Import| E
        style C fill:#90EE90
        style D fill:#90EE90
        style E fill:#90EE90
    end
```

## Final Directory Structure

```mermaid
graph TB
    subgraph "src/modules/customers/"
        subgraph "domain/ (Core)"
            A[entities/customer.entity.ts]
            B[value-objects/]
            C[repositories/customer.repository.ts]
            D[ports/cryptography.port.ts]
        end
        
        subgraph "application/ (Use Cases)"
            E[commands/]
            F[queries/]
            G[use-cases/]
        end
        
        subgraph "infrastructure/ (Adapters)"
            H[adapters/http/customer-http.adapter.ts]
            I[adapters/cryptography/cryptography.adapter.ts]
            J[mappers/customer.mapper.ts]
            K[customer.typeorm.repository.ts]
            L[customer.entity.ts]
        end
        
        subgraph "presentation/ (DTOs)"
            M[dtos/create-customer-request.dto.ts]
            N[dtos/update-customer-request.dto.ts]
        end
        
        O[customers.module.ts]
    end
    
    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#87CEEB
    style F fill:#87CEEB
    style G fill:#87CEEB
    style H fill:#FFB6C1
    style I fill:#FFB6C1
    style J fill:#FFB6C1
    style K fill:#FFB6C1
    style L fill:#FFB6C1
    style M fill:#DDA0DD
    style N fill:#DDA0DD
    style O fill:#FFA07A
```

## Conclusion

The migration to Hexagonal Architecture has transformed the Customer module from a tightly coupled, hard-to-test system into a flexible, maintainable, and testable solution that follows industry best practices.

### Key Achievements:

1. **Domain-Centric Design**: Business logic is now centralized in the domain layer
2. **Dependency Inversion**: All dependencies point inward to the domain
3. **Ports & Adapters**: Clean separation between business logic and infrastructure
4. **CQRS Pattern**: Clear separation between read and write operations
5. **Rich Domain Model**: Entities contain behavior, not just data
6. **Value Objects**: Encapsulated validation and business rules
7. **Testability**: Each layer can be tested in isolation
8. **Flexibility**: Easy to swap implementations and add new features
9. **Cross-Module Independence**: No direct domain dependencies between modules
10. **Project-Wide Compatibility**: All modules work together seamlessly

### Final Validation Results:

- **✅ TypeScript Compilation**: 0 errors across entire project
- **✅ Architecture Compliance**: Pure hexagonal architecture implemented
- **✅ Business Logic**: All original functionality preserved and enhanced
- **✅ Data Encryption**: Sensitive data properly encrypted/decrypted
- **✅ Cross-Module Compatibility**: All modules work together seamlessly

This architecture provides a solid foundation for future development and ensures the system can evolve with changing business requirements while maintaining code quality and testability.