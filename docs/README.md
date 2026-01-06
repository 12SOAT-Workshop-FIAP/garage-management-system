# Documentação Técnica - Garage Management System

Este diretório contém a documentação técnica completa do sistema de gestão de garagem, incluindo RFCs (Request for Comments), ADRs (Architecture Decision Records), guias de migração e justificativas de decisões arquiteturais.

## Estrutura da Documentação

```
docs/
├── README.md                                    # Este arquivo
├── visao-geral-arquitetura.md                  # Visão geral da arquitetura do sistema
├── justificativa-banco-dados-modelo-relacional.md # Justificativa do modelo de dados
├── hexagonal-architecture-migration.md          # Guia de migração para Arquitetura Hexagonal
├── rfc/                                         # Request for Comments (Decisões Técnicas)
│   ├── RFC-001-escolha-banco-dados.md
│   ├── RFC-002-escolha-nuvem-aws.md
│   └── RFC-003-estrategia-autenticacao.md
└── adr/                                         # Architecture Decision Records (Decisões Arquiteturais)
    ├── ADR-001-arquitetura-hexagonal.md
    ├── ADR-002-cqrs-pattern.md
    └── ADR-003-kubernetes-escalabilidade.md
```

## Documentação de Arquitetura

### [Visão Geral da Arquitetura](./visao-geral-arquitetura.md)

Documentação completa da arquitetura de alto nível do sistema, incluindo:
- Stack tecnológica
- Arquitetura da aplicação (Hexagonal Architecture)
- Módulos principais
- Fluxo de requisições
- Estratégias de escalabilidade e segurança
- Modelo de dados

### [Justificativa do Banco de Dados e Modelo Relacional](./justificativa-banco-dados-modelo-relacional.md)

Documentação detalhada sobre:
- Justificativa formal da escolha do PostgreSQL
- Descrição completa de todas as tabelas do modelo relacional
- Diagrama ER completo em formato Mermaid
- Explicação dos relacionamentos entre entidades
- Fluxos de uso comuns
- Índices e otimizações recomendadas
- Considerações de segurança e privacidade

### [Hexagonal Architecture Migration Guide](./hexagonal-architecture-migration.md)

Guia completo demonstrando a migração do módulo Customer de arquitetura tradicional para Arquitetura Hexagonal (Ports & Adapters).

**O que você aprenderá:**
- ✅ Comparação de arquitetura (Antes vs Depois)
- ✅ Processo de migração passo a passo
- ✅ Refatoração da camada de domínio com Value Objects
- ✅ Implementação do padrão CQRS
- ✅ Padrão Ports & Adapters
- ✅ Estratégia de testes e boas práticas
- ✅ Benefícios alcançados e lições aprendidas

## RFCs (Request for Comments)

RFCs documentam **decisões técnicas** específicas sobre tecnologias, ferramentas e implementações.

### RFC-001: Escolha do Banco de Dados Principal
**Status:** Accepted  
Documenta a escolha do PostgreSQL como SGBD principal, incluindo justificativas, alternativas consideradas e plano de implementação.

[Ler RFC-001 →](./rfc/RFC-001-escolha-banco-dados.md)

### RFC-002: Escolha da Nuvem e Estratégia de Deploy
**Status:** Accepted  
Documenta a escolha da AWS como plataforma cloud, arquitetura de infraestrutura (EKS, RDS, Lambda) e estratégias de deploy.

[Ler RFC-002 →](./rfc/RFC-002-escolha-nuvem-aws.md)

### RFC-003: Estratégia de Autenticação e Autorização
**Status:** Accepted  
Documenta a escolha de JWT stateless authentication, implementação híbrida (Lambda + NestJS) e estratégias de segurança.

[Ler RFC-003 →](./rfc/RFC-003-estrategia-autenticacao.md)

## ADRs (Architecture Decision Records)

ADRs documentam **decisões arquiteturais permanentes** que afetam a estrutura, comportamento ou propriedades não-funcionais do sistema.

### ADR-001: Arquitetura Hexagonal (Ports & Adapters)
**Status:** Accepted  
Documenta a adoção da Arquitetura Hexagonal como padrão arquitetural principal, incluindo estrutura de camadas e benefícios.

[Ler ADR-001 →](./adr/ADR-001-arquitetura-hexagonal.md)

### ADR-002: Padrão CQRS (Command Query Responsibility Segregation)
**Status:** Accepted  
Documenta a separação de Commands e Queries na camada de aplicação, incluindo justificativas e estrutura de implementação.

[Ler ADR-002 →](./adr/ADR-002-cqrs-pattern.md)

### ADR-003: Kubernetes e Estratégias de Escalabilidade
**Status:** Accepted  
Documenta a escolha do Amazon EKS e estratégias de escalabilidade (HPA, Cluster Autoscaling), incluindo configurações e métricas.

[Ler ADR-003 →](./adr/ADR-003-kubernetes-escalabilidade.md)

## Conceitos-Chave

### 🏗️ Hexagonal Architecture
- **Domain Layer**: Lógica de negócio central e regras
- **Application Layer**: Use cases e orquestração
- **Infrastructure Layer**: Adaptadores de sistemas externos
- **Ports & Adapters**: Separação clara de responsabilidades

### 🎯 Domain-Driven Design
- **Rich Domain Models**: Entidades com comportamento
- **Value Objects**: Validação encapsulada
- **Domain Services**: Regras de negócio complexas
- **Aggregates**: Limites de consistência

### 🔄 CQRS Pattern
- **Commands**: Operações de escrita
- **Queries**: Operações de leitura
- **Use Cases**: Handlers de Command/Query
- **Separation**: Otimizado para diferentes preocupações

### 🧪 Testing Strategy
- **Unit Tests**: Testes rápidos e isolados
- **Integration Tests**: Testes de interação de componentes
- **E2E Tests**: Testes de sistema completo
- **Test Pyramid**: Distribuição ótima de testes

## Benefícios da Arquitetura

### ✅ Manutenibilidade
- Lógica de negócio centralizada
- Separação clara de responsabilidades
- Fácil de entender e modificar

### ✅ Testabilidade
- Cada camada testável isoladamente
- Design amigável a mocks
- Testes rápidos e confiáveis

### ✅ Flexibilidade
- Fácil trocar implementações
- Simples adicionar novas funcionalidades
- Core agnóstico de tecnologia

### ✅ Escalabilidade
- CQRS permite otimização de leitura/escrita
- Limites limpos para microserviços
- Design focado em performance

## Como Usar Esta Documentação

### Para Desenvolvedores

1. **Comece pela Visão Geral** para entender a arquitetura de alto nível
2. **Leia os ADRs** para entender as decisões arquiteturais fundamentais
3. **Consulte os RFCs** quando precisar entender escolhas técnicas específicas
4. **Use a justificativa do banco de dados** como referência para o modelo de dados
5. **Siga o guia de migração** ao trabalhar com novos módulos ou refatorações

### Para Arquitetos e Tech Leads

1. **Revise ADRs** antes de propor mudanças arquiteturais significativas
2. **Crie novos ADRs** quando novas decisões arquiteturais forem tomadas
3. **Atualize RFCs** quando tecnologias ou implementações mudarem
4. **Mantenha a documentação atualizada** conforme o sistema evolui

### Para Gestores e Stakeholders

1. **Leia a Visão Geral** para entender o sistema como um todo
2. **Consulte os ADRs** para entender as escolhas arquiteturais e seus trade-offs
3. **Revise RFCs** para entender decisões técnicas que impactam custos, prazos ou riscos

## Convenções de Documentação

### Status dos Documentos

- **Proposed**: Proposta inicial, aguardando aprovação
- **Accepted**: Decisão aceita e implementada
- **Rejected**: Decisão rejeitada (deve incluir motivo)
- **Deprecated**: Decisão substituída por outra (deve referenciar nova decisão)
- **Superseded**: Decisão superada por outra (mesmo conceito de deprecated)

### Formato dos Documentos

- **Markdown**: Todos os documentos são escritos em Markdown
- **Diagramas**: Diagramas são criados em Mermaid quando possível
- **Referências**: Cada documento referencia código relevante no repositório
- **Data**: Todos os documentos incluem data de criação/atualização

## Manutenção da Documentação

### Quando Criar um Novo Documento

- **Novo ADR**: Quando uma decisão arquitetural permanente é tomada
- **Novo RFC**: Quando uma decisão técnica significativa é tomada (tecnologia, ferramenta, padrão de implementação)
- **Atualizar Existente**: Quando uma decisão é revisada, modificada ou substituída

### Processo de Atualização

1. Criar/editar documento em Markdown
2. Revisar com a equipe técnica
3. Aprovar e atualizar status
4. Commit no repositório
5. Atualizar este README se necessário

## Recursos Externos

- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [RFC 2119 - Key words for use in RFCs](https://tools.ietf.org/html/rfc2119)
- [Mermaid Diagram Syntax](https://mermaid.js.org/)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design by Eric Evans](https://domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern by Microsoft](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

## Contribuindo

Ao contribuir para este projeto, siga os padrões estabelecidos:

1. **Domain First**: Comece com entidades de domínio e value objects
2. **Ports & Adapters**: Defina interfaces antes das implementações
3. **CQRS**: Separe commands e queries
4. **Test Coverage**: Mantenha alta cobertura de testes
5. **Documentation**: Atualize a documentação para novos padrões

## Contato

Para questões sobre esta documentação ou para propor novas decisões, entre em contato com a equipe de arquitetura do projeto.
