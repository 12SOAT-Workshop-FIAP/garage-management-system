# ADR-002: Padrão CQRS (Command Query Responsibility Segregation)

**Status:** Accepted  
**Data:** 2024-12-19  
**Autores:** Equipe de Arquitetura

## Contexto

O sistema de gestão de garagem possui operações distintas:

- **Comandos (Writes)**: Criar cliente, atualizar ordem de serviço, registrar peça
- **Queries (Reads)**: Listar clientes, buscar ordem por ID, consultar estoque

Historicamente, essas operações eram tratadas da mesma forma, mas têm necessidades diferentes:

- Writes precisam de validação complexa, transações, integridade referencial
- Reads precisam de performance, otimizações de consulta, projeções específicas

Foi necessário decidir se separar comandos e queries traz benefícios suficientes para justificar a complexidade adicional.

## Decisão

**Adotaremos o padrão CQRS (Command Query Responsibility Segregation) na camada de aplicação.**

Separação será feita através de:

1. **Commands**: Classes que representam intenções de escrita (CreateCustomerCommand, UpdateWorkOrderCommand)
2. **Queries**: Classes que representam intenções de leitura (FindCustomerByIdQuery, FindAllPartsQuery)
3. **Use Cases Separados**: Handlers distintos para commands e queries
4. **DTOs Específicos**: DTOs de entrada e saída específicos para cada operação

## Consequências

### Positivas

1. **Clareza de Intenção**:
   - Código deixa explícito se operação é leitura ou escrita
   - Facilita entendimento e manutenção
   - Reduz risco de efeitos colaterais acidentais em queries

2. **Otimizações Independentes**:
   - Queries podem usar projeções otimizadas (menos campos, joins específicos)
   - Commands podem focar em validação e integridade
   - Permite cache específico para queries sem afetar commands

3. **Escalabilidade Futura**:
   - Base para separar reads e writes em diferentes serviços (se necessário)
   - Permite read models otimizados (ex: views materializadas)
   - Facilita implementação de Event Sourcing no futuro

4. **Testabilidade**:
   - Testes de commands focados em validação e persistência
   - Testes de queries focados em retorno de dados
   - Mocks mais específicos e fáceis de criar

5. **Alinhamento com Hexagonal Architecture**:
   - CQRS se alinha naturalmente com separação domain/application/infrastructure
   - Use cases específicos facilitam implementação de ports

6. **Flexibilidade de Implementação**:
   - Queries podem usar repositórios diferentes (otimizados para leitura)
   - Commands podem usar repositórios com transações explícitas
   - Permite diferentes estratégias de cache

### Negativas

1. **Mais Classes e Arquivos**:
   - Necessário criar Command/Query + Use Case para cada operação
   - Mais arquivos para navegar
   - **Mitigação**: Organização clara por módulo; benefícios superam complexidade

2. **Overhead Inicial**:
   - Mais código boilerplate
   - **Mitigação**: Templates e exemplos facilitam criação; IDEs ajudam com geração

3. **Duplicação Potencial**:
   - Alguma duplicação entre commands/queries similares
   - **Mitigação**: Compartilhar lógica comum através de services ou base classes

4. **Curva de Aprendizado**:
   - Desenvolvedores precisam entender o padrão
   - **Mitigação**: Documentação e exemplos no código

## Implementação

### Estrutura de Commands e Queries

```typescript
// Command Example
export class CreateCustomerCommand {
  constructor(
    public readonly name: string,
    public readonly document: string,
    public readonly email?: string,
    public readonly phone: string,
    public readonly personType: 'INDIVIDUAL' | 'COMPANY',
  ) {}
}

// Query Example
export class FindCustomerByIdQuery {
  constructor(public readonly id: number) {}
}

// Use Case Example
@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cryptographyPort: CryptographyPort,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    // Validation, business logic, persistence
  }
}
```

### Padrão de Nomenclatura

- **Commands**: `{Action}{Entity}Command` (CreateCustomerCommand, UpdateWorkOrderCommand)
- **Queries**: `{Action}{Entity}Query` (FindCustomerByIdQuery, FindAllCustomersQuery)
- **Use Cases**: `{Action}{Entity}UseCase` (CreateCustomerUseCase, FindCustomerByIdUseCase)

### Organização de Pastas

```
application/
├── commands/
│   ├── create-customer.command.ts
│   ├── update-customer.command.ts
│   └── delete-customer.command.ts
├── queries/
│   ├── find-customer-by-id.query.ts
│   ├── find-customer-by-document.query.ts
│   └── find-all-customers.query.ts
└── use-cases/
    ├── create-customer.use-case.ts
    ├── update-customer.use-case.ts
    ├── delete-customer.use-case.ts
    ├── find-customer-by-id.use-case.ts
    ├── find-customer-by-document.use-case.ts
    └── find-all-customers.use-case.ts
```

## Quando NÃO Usar CQRS

CQRS não é aplicado em todos os casos:

- **Operações Simples**: Para operações muito simples (ex: health check), pode ser overkill
- **Operações Híbridas**: Algumas operações podem ser read+write (ex: "marcar como lido"); avaliar caso a caso
- **Prototipagem Rápida**: Para protótipos/MVP, pode pular CQRS inicialmente e refatorar depois

## Evolução Futura

O CQRS atual é "simples" (mesma base de dados para reads e writes). Futuras evoluções podem incluir:

1. **Read Models Separados**: Views materializadas ou tabelas dedicadas para queries
2. **Event Sourcing**: Commands geram eventos; queries leem de event store
3. **Separate Services**: Commands e queries em serviços diferentes para escala independente

## Referências

- [CQRS Pattern by Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [Microsoft CQRS Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- Implementação exemplo: `garage-management-system/src/modules/customers/application/`

