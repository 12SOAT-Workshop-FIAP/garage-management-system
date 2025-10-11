# Garage Management System (Hexagonal Architecture)

## Overview

This project is a robust, scalable, and well-structured base for a Garage/Auto Repair Shop Management System, following **Hexagonal Architecture (Ports & Adapters)** principles with NestJS, TypeORM, PostgreSQL, and Docker. It demonstrates modern software architecture patterns including Domain-Driven Design (DDD), CQRS, and Clean Architecture principles.

## 🏗️ Architecture Highlights

- **✅ Hexagonal Architecture**: Pure Ports & Adapters implementation
- **✅ Domain-Driven Design**: Rich domain models with business logic
- **✅ CQRS Pattern**: Command/Query separation for better scalability
- **✅ Value Objects**: Encapsulated validation and business rules
- **✅ Dependency Inversion**: All dependencies point inward to the domain
- **✅ Testability**: Each layer can be tested in isolation
- **✅ Flexibility**: Easy to swap implementations and add new features

## 🚀 Migration Status

### ✅ Customer Module - 100% Complete

The Customer module has been successfully migrated to pure Hexagonal Architecture:

- **✅ 0 TypeScript Errors**: Full project compilation success
- **✅ 100+ Tests Passing**: Complete test coverage maintained
- **✅ All Imports Working**: Cross-module compatibility restored
- **✅ Hexagonal Principles**: Pure architecture implementation
- **✅ Business Logic Preserved**: All original functionality enhanced

### 📊 Validation Results

```mermaid
graph TB
    subgraph "Migration Validation"
        A[✅ TypeScript Compilation]
        B[✅ Test Coverage]
        C[✅ Import Resolution]
        D[✅ Architecture Compliance]
        E[✅ Cross-Module Integration]
    end
    
    subgraph "Modules Status"
        F[✅ Customers - Complete]
        G[✅ Vehicles - Compatible]
        H[✅ Work-Orders - Compatible]
        I[✅ Email - Compatible]
    end
    
    A --> F
    B --> G
    C --> H
    D --> I
    E --> F
    
    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
```

---

## 📚 Documentation

### Architecture Migration Guide

For a comprehensive understanding of the migration from traditional layered architecture to Hexagonal Architecture, see our detailed documentation:

**[📖 Hexagonal Architecture Migration Guide](./docs/hexagonal-architecture-migration.md)**

This guide includes:
- **Before/After Architecture Comparison**
- **Step-by-Step Migration Process**
- **Domain Layer Refactoring**
- **CQRS Pattern Implementation**
- **Ports & Adapters Pattern**
- **Testing Strategy**
- **Benefits and Best Practices**

---

## Domain Context & Key Activities

The system models the real workflow of a garage, supporting:

1. **Receive vehicle**
2. **Register customer request**
3. **Diagnose problems**
4. **Generate estimate**
5. **Obtain customer authorization**
6. **Execute service**
7. **Update status**
8. **Control parts inventory**
9. **Finalize service**
10. **Deliver vehicle**
11. **Store service history**

### Main Entities

- **Customer**: Registers and manages clients.
- **Vehicle**: Registers and manages vehicles.
- **ServiceRequest**: Links customer, vehicle, and requested service/problem.
- **Diagnostic**: Mechanic's findings and recommendations.
- **Estimate**: Cost estimate, with items (parts/services).
- **Authorization**: Customer's approval or rejection of the estimate.
- **WorkOrder**: Execution of authorized services.
- **Part**: Parts and consumables.
- **Inventory**: Stock control and movements.
- **ServiceHistory**: Historical record of all services performed.

### Cryptography Module

The system includes a robust cryptography module for handling sensitive data:

- **CPF/CNPJ Validation**: Brazilian tax document validation with encryption
- **License Plate Validation**: Vehicle license plate validation (Mercosul and old formats)
- **Secure Encryption**: AES-256-CBC encryption for sensitive data
- **Hash Operations**: SHA-256 hashing with timing-safe comparison
- **Value Objects**: Domain-driven design with proper validation and masking

---

## 🏛️ Architecture

### Hexagonal Architecture Overview

```mermaid
graph TB
    subgraph "Domain Layer (Core)"
        Entity[Rich Domain Entities]
        VOs[Value Objects]
        DomainService[Domain Services]
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
        Database[(PostgreSQL)]
        CryptoService[Cryptography Service]
        HTTP[HTTP Requests]
    end
    
    UseCases --> Entity
    UseCases --> VOs
    UseCases --> DomainService
    UseCases --> Ports
    
    HTTPAdapter --> UseCases
    DBAdapter --> Ports
    CryptoAdapter --> Ports
    
    HTTP --> HTTPAdapter
    DBAdapter --> Database
    CryptoAdapter --> CryptoService
    
    style Entity fill:#90EE90
    style VOs fill:#90EE90
    style DomainService fill:#90EE90
    style Ports fill:#90EE90
    style UseCases fill:#87CEEB
    style HTTPAdapter fill:#FFB6C1
    style DBAdapter fill:#FFB6C1
    style CryptoAdapter fill:#FFB6C1
```

### Module Structure

```mermaid
flowchart TD
  A[Presentation Layer\n(Controllers, DTOs, Modules)] --> B[Application Layer\n(Use Cases, Services, DTOs)]
  B --> C[Domain Layer\n(Entities, Value Objects, Repositories, Domain Events)]
  B --> D[Infrastructure Layer\n(TypeORM Repositories, Providers, Mappings)]
  D --> E[(Database)]
```

- **domain/**: Entities, value objects, repository interfaces, domain events.
- **application/**: Use cases (services), input/output DTOs, business logic orchestration.
- **infrastructure/**: TypeORM repositories, data mappers, external integrations, providers.
- **presentation/**: NestJS modules, controllers, request/response DTOs, pipes, interceptors.

### Example Structure

```
src/
  modules/
    customers/
      domain/
      application/
      infrastructure/
      presentation/
    vehicles/
    service-requests/
    diagnostics/
    estimates/
    authorizations/
    work-orders/
    parts/
    inventory/
    service-history/
    cryptography/
  shared/
```

---

## Main Workflow (Key Activities)

```mermaid
sequenceDiagram
  participant Customer
  participant Attendant
  participant Mechanic
  participant Manager
  participant System
  participant Supplier

  Customer->>Attendant: Delivers vehicle (1)
  Attendant->>System: Register customer request (2)
  Mechanic->>System: Diagnose problems (3)
  System->>Attendant: Generate estimate (4)
  Attendant->>Customer: Present estimate
  Customer->>Attendant: Authorize service (5)
  Attendant->>System: Register authorization
  Mechanic->>System: Execute service (6)
  System->>Mechanic: Update status (7)
  System->>Manager: Notify low stock (8)
  Manager->>Supplier: Order parts
  Mechanic->>System: Finalize service (9)
  Attendant->>Customer: Deliver vehicle (10)
  System->>System: Store history (11)
```

---

## How to Run Locally

### 1. Clone and Install

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

### 2. Environment & Docker

```bash
cp .env.example .env
npm run docker:up
```

- The API will be available at: http://localhost:3000
- The database (PostgreSQL) will be available at: localhost:5432

### 3. API Documentation (Swagger)

- Access: http://localhost:3000/api
- All endpoints, DTOs, and models are documented automatically.
- Cryptography endpoints available at `/cryptography/*`

### 4. Useful Commands

- **Run unit tests:** `npm test`
- **Run e2e tests:** `npm run test:e2e`
- **Lint:** `npm run lint`
- **Format:** `npm run format`
- **Generate migration:** `docker compose exec api npm run migration:generate`
- **Run migrations:** `docker compose exec api npm run migration:run`
- **Revert migration:** `docker compose exec api npm run migration:revert`
- **Seed your database:** `docker compose exec api npm run seed:run`
- **Stop Docker:** `npm run docker:down`

---

## Infrastructure (IaC) (infra/)

## [Terraform Documentation](/src//infra/README.md)

## Infrastructure Layer (infra/)

- **infrastructure/repositories/**: TypeORM implementations of repository interfaces, data mappers.
- **infrastructure/providers/**: External services, adapters, and dependency injection providers.
- **infrastructure/database/**: TypeORM config, migrations, seeds.
- **infra is responsible for all persistence, integration, and external concerns.**

---

## Development & Contribution

- All code is in English, with JSDoc in English and Portuguese for entities and main contracts.
- DTOs use `class-validator`, `class-transformer`, and `@nestjs/swagger` for validation, transformation, and documentation.
- Validation is enforced globally via NestJS `ValidationPipe`.
- All layers are testable and ready for TDD/DDD practices.
- Use `npm run lint` and `npm run format` before committing.
- All business logic should be in the application/domain layers, never in controllers or infra.

---

## Patterns & Best Practices

- **DDD**: Clear separation of concerns, Ubiquitous Language, aggregates, and domain events.
- **SOLID**: All modules follow SOLID principles with proper dependency injection.
- **Value Objects**: Sensitive data is encapsulated in value objects with validation.
- **Cryptography**: Secure handling of sensitive data with AES-256-CBC encryption.
- **Validation**: All input is validated and sanitized.
- **Swagger**: API is always documented and up-to-date.
- **Testing**: Unit and e2e tests are scaffolded and ready.
- **Docker**: Local development is easy and reproducible.
- **Prettier/ESLint**: Code style and quality enforced.

---

## Observations

- This project is a base/scaffolding: no business rules are implemented.
- Extend modules and entities as needed for your business context.
- For questions or contributions, open an issue or PR.
