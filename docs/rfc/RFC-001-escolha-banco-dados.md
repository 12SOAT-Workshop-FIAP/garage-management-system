# RFC-001: Escolha do Banco de Dados Principal

**Status:** Accepted  
**Data:** 2024-12-19  
**Autores:** Equipe de Arquitetura

## Contexto

O sistema de gestão de garagem (Garage Management System) necessita de um banco de dados robusto para armazenar informações críticas de negócio, incluindo:

- Dados de clientes e veículos
- Ordens de serviço e histórico
- Controle de estoque de peças
- Usuários e autenticação
- Relacionamentos complexos entre entidades

É essencial escolher um SGBD que atenda aos requisitos funcionais e não-funcionais do sistema, garantindo consistência, integridade referencial, suporte a transações ACID e integração com a infraestrutura AWS.

## Alternativas Consideradas

### 1. PostgreSQL (Escolhido)

**Prós:**
- Suporte completo a ACID e transações
- Relacionamentos complexos e integridade referencial robusta
- Tipos de dados avançados (JSONB, UUID, arrays)
- Excelente suporte ao TypeORM (ORM escolhido)
- Disponibilidade nativa na AWS RDS
- Open source com grande comunidade
- Suporte a migrações versionadas
- Performance excelente para operações relacionais
- Suporte a índices avançados (GIN, GiST, etc.)

**Contras:**
- Requer conhecimento de SQL (não é um impedimento para o time)
- Configuração pode ser mais complexa que soluções NoSQL simples

### 2. MySQL/MariaDB

**Prós:**
- Amplamente adotado
- Bom suporte no AWS RDS
- Performance boa para leituras

**Contras:**
- Tipos de dados mais limitados que PostgreSQL
- Suporte menos robusto a JSON nativo
- Algumas limitações em consultas complexas
- Menor suporte a recursos avançados

### 3. Amazon DynamoDB

**Prós:**
- Totalmente gerenciado pela AWS
- Escalabilidade horizontal automática
- Performance previsível

**Contras:**
- Modelo NoSQL dificulta relacionamentos complexos
- Não suporta transações complexas entre múltiplas entidades
- Custo pode ser alto para padrões de acesso não otimizados
- Migração complexa para o modelo relacional existente
- Não suporta TypeORM de forma nativa

### 4. MongoDB

**Prós:**
- Flexibilidade de esquema
- Boa integração com Node.js/TypeScript

**Contras:**
- Não oferece garantias ACID fortes por padrão
- Relacionamentos complexos requerem joins no código da aplicação
- Não se alinha com o modelo relacional necessário
- Menor suporte no ecossistema AWS

## Decisão

**PostgreSQL será utilizado como banco de dados principal do sistema.**

A escolha recai sobre PostgreSQL 17 (versão utilizada em desenvolvimento via Docker) hospedado no **AWS RDS** para ambientes de produção.

## Racional

1. **Modelo Relacional Adequado**: O domínio de gestão de garagem possui relacionamentos complexos (Clientes → Veículos → Ordens de Serviço → Peças/Serviços) que se beneficiam de um modelo relacional com integridade referencial.

2. **Integridade de Dados**: PostgreSQL oferece constraints robustas (foreign keys, unique, check) que garantem consistência dos dados críticos de negócio.

3. **Integração com Stack Tecnológica**:
   - TypeORM oferece suporte nativo e maduro ao PostgreSQL
   - NestJS tem excelente integração com TypeORM
   - Migrações versionadas facilitam evolução do schema

4. **Requisitos de Transações**: O sistema precisa de transações ACID para operações críticas (ex: criar ordem de serviço com múltiplas peças e serviços).

5. **Ecosistema AWS**: AWS RDS para PostgreSQL oferece:
   - Backups automatizados
   - Read replicas para escalabilidade de leitura
   - High Availability com Multi-AZ
   - Monitoramento integrado com CloudWatch
   - Patches e updates gerenciados

6. **Conformidade e Segurança**: PostgreSQL oferece recursos de segurança avançados (RLS - Row Level Security, criptografia em trânsito e em repouso via RDS).

7. **Custo-Benefício**: Solução open source com custos previsíveis no RDS, adequada ao porte do projeto.

## Impacto

### Impactos Positivos

- **Consistência de Dados**: Garantia de integridade referencial em todas as operações
- **Desenvolvimento Ágil**: TypeORM facilita o desenvolvimento e manutenção
- **Escalabilidade Vertical**: RDS permite upgrade de instância conforme necessário
- **Migrações Versionadas**: Controle preciso sobre evolução do schema
- **Debugging e Análise**: Ferramentas SQL maduras facilitam análise de dados e troubleshooting

### Impactos Negativos e Mitigações

- **Escalabilidade Horizontal Limitada**: PostgreSQL escala melhor verticalmente que horizontalmente
  - **Mitigação**: Implementar read replicas para escalar leituras; considerar sharding futuro se necessário
- **Custo do RDS**: Pode ser mais caro que soluções self-hosted em longo prazo
  - **Mitigação**: Usar instâncias reservadas para reduzir custos; monitorar uso e ajustar tamanho da instância
- **Gestão de Conexões**: Requer pool de conexões adequado
  - **Mitigação**: TypeORM gerencia pools automaticamente; configurar limites apropriados

## Plano de Implementação

1. ✅ **Desenvolvimento Local**: Docker Compose com PostgreSQL 17 (já implementado)
2. ✅ **Migrações TypeORM**: Sistema de migrações versionadas configurado
3. ✅ **RDS Provisioning**: Terraform configura instância RDS PostgreSQL
4. ⚠️ **Produção**: Configurar Multi-AZ, backups automatizados e read replicas conforme necessidade
5. ⚠️ **Monitoramento**: Configurar alertas CloudWatch para métricas críticas (CPU, memória, conexões)
6. ⚠️ **Segurança**: Revisar configurações de acesso (remover `publicly_accessible = true` em produção)

## Referências

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [AWS RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [TypeORM PostgreSQL Driver](https://typeorm.io/#/connection-options/postgres--cockroachdb-connection-options)
- Configuração atual: `garage-management-database/modules/rds/main.tf`
- ORM Config: `garage-management-system/ormconfig.ts`

