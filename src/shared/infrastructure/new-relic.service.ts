import { Injectable } from '@nestjs/common';
import * as newrelic from 'newrelic';

/**
 * New Relic Service
 * 
 * Wrapper para a API do New Relic SDK
 * Fornece métodos tipados e documentados para:
 * - Custom Metrics
 * - Custom Events
 * - Custom Attributes
 * - Error Tracking
 * - Transaction Control
 * 
 * @example
 * ```typescript
 * constructor(private readonly newRelicService: NewRelicService) {}
 * 
 * this.newRelicService.recordMetric('WorkOrders/Created', 1);
 * this.newRelicService.recordEvent('WorkOrderCompleted', { orderId: '123', value: 1500 });
 * ```
 */
@Injectable()
export class NewRelicService {
  /**
   * Registra uma métrica customizada
   * 
   * Métricas são valores numéricos que podem ser agregados (sum, average, count)
   * 
   * @param name Nome da métrica (ex: 'Custom/WorkOrders/Created')
   * @param value Valor numérico
   * 
   * @example
   * ```typescript
   * this.newRelicService.recordMetric('Custom/WorkOrders/TotalValue', 1500.00);
   * this.newRelicService.recordMetric('Custom/WorkOrders/Created', 1);
   * ```
   */
  recordMetric(name: string, value: number): void {
    try {
      newrelic.recordMetric(name, value);
    } catch (error) {
      console.error('Failed to record New Relic metric:', error);
    }
  }

  /**
   * Registra um evento customizado
   * 
   * Eventos são registros estruturados que podem ser consultados com NRQL
   * Use para eventos de negócio importantes
   * 
   * @param eventType Nome do tipo de evento (ex: 'WorkOrderCompleted')
   * @param attributes Atributos do evento
   * 
   * @example
   * ```typescript
   * this.newRelicService.recordEvent('WorkOrderCompleted', {
   *   orderId: '123',
   *   customerId: 'customer-456',
   *   totalValue: 1500.00,
   *   serviceCount: 3,
   *   completionTimeMs: 45000
   * });
   * ```
   */
  recordEvent(eventType: string, attributes: Record<string, any>): void {
    try {
      newrelic.recordCustomEvent(eventType, attributes);
    } catch (error) {
      console.error('Failed to record New Relic event:', error);
    }
  }

  /**
   * Adiciona um atributo customizado à transação atual
   * 
   * Atributos aparecem no trace da transação no APM
   * Útil para filtrar e agrupar transações
   * 
   * @param key Nome do atributo
   * @param value Valor do atributo
   * 
   * @example
   * ```typescript
   * this.newRelicService.addCustomAttribute('userId', user.id);
   * this.newRelicService.addCustomAttribute('userRole', user.role);
   * this.newRelicService.addCustomAttribute('customerTier', 'premium');
   * ```
   */
  addCustomAttribute(key: string, value: string | number | boolean): void {
    try {
      newrelic.addCustomAttribute(key, value);
    } catch (error) {
      console.error('Failed to add New Relic custom attribute:', error);
    }
  }

  /**
   * Adiciona múltiplos atributos customizados de uma vez
   * 
   * @param attributes Objeto com pares chave-valor
   * 
   * @example
   * ```typescript
   * this.newRelicService.addCustomAttributes({
   *   userId: user.id,
   *   userRole: user.role,
   *   orderId: order.id,
   *   customerTier: 'premium'
   * });
   * ```
   */
  addCustomAttributes(attributes: Record<string, string | number | boolean>): void {
    try {
      newrelic.addCustomAttributes(attributes);
    } catch (error) {
      console.error('Failed to add New Relic custom attributes:', error);
    }
  }

  /**
   * Reporta um erro para o New Relic com contexto customizado
   * 
   * @param error Objeto de erro
   * @param customAttributes Atributos adicionais para contexto
   * 
   * @example
   * ```typescript
   * try {
   *   await this.processPayment(orderId, amount);
   * } catch (error) {
   *   this.newRelicService.noticeError(error, {
   *     orderId,
   *     amount,
   *     paymentMethod: 'credit_card',
   *     attemptNumber: 3
   *   });
   *   throw error;
   * }
   * ```
   */
  noticeError(error: Error, customAttributes?: Record<string, any>): void {
    try {
      newrelic.noticeError(error, customAttributes);
    } catch (err) {
      console.error('Failed to notice error in New Relic:', err);
    }
  }

  /**
   * Define o nome da transação atual
   * 
   * Útil para transações não-HTTP (background jobs, workers)
   * 
   * @param name Nome da transação
   * 
   * @example
   * ```typescript
   * this.newRelicService.setTransactionName('EmailQueueProcessor');
   * ```
   */
  setTransactionName(name: string): void {
    try {
      newrelic.setTransactionName(name);
    } catch (error) {
      console.error('Failed to set New Relic transaction name:', error);
    }
  }

  /**
   * Ignora a transação atual (não envia para New Relic)
   * 
   * Útil para health checks e endpoints que não precisam ser monitorados
   * Reduz custos de ingestão
   * 
   * @example
   * ```typescript
   * @Get('/health')
   * async healthCheck() {
   *   this.newRelicService.ignoreTransaction();
   *   return { status: 'ok' };
   * }
   * ```
   */
  ignoreTransaction(): void {
    try {
      const transaction = newrelic.getTransaction();
      if (transaction) {
        transaction.ignore();
      }
    } catch (error) {
      console.error('Failed to ignore New Relic transaction:', error);
    }
  }

  /**
   * Cria um segmento customizado (span) para rastrear uma operação específica
   * 
   * Aparece no distributed tracing como um span filho
   * 
   * @param name Nome do segmento
   * @param record Se deve gravar o segmento
   * @param handler Função a ser executada dentro do segmento
   * @returns Resultado da função handler
   * 
   * @example
   * ```typescript
   * const total = await this.newRelicService.startSegment(
   *   'calculateOrderTotal',
   *   true,
   *   async () => {
   *     const basePrice = await this.calculateBasePrice(orderId);
   *     const discounts = await this.calculateDiscounts(orderId);
   *     return basePrice - discounts;
   *   }
   * );
   * ```
   */
  async startSegment<T>(
    name: string,
    record: boolean,
    handler: () => Promise<T> | T,
  ): Promise<T> {
    try {
      return await newrelic.startSegment(name, record, handler);
    } catch (error) {
      console.error('Failed to start New Relic segment:', error);
      return handler();
    }
  }

  /**
   * Inicia uma transação em background (não-HTTP)
   * 
   * Use para jobs, workers, scheduled tasks
   * 
   * @param name Nome da transação
   * @param handler Função a ser executada
   * @returns Resultado da função handler
   * 
   * @example
   * ```typescript
   * async processEmailQueue() {
   *   await this.newRelicService.startBackgroundTransaction(
   *     'EmailQueueProcessor',
   *     async () => {
   *       const emails = await this.getEmailsToSend();
   *       for (const email of emails) {
   *         await this.sendEmail(email);
   *       }
   *     }
   *   );
   * }
   * ```
   */
  async startBackgroundTransaction<T>(
    name: string,
    handler: () => Promise<T> | T,
  ): Promise<T> {
    try {
      return await newrelic.startBackgroundTransaction(name, handler);
    } catch (error) {
      console.error('Failed to start New Relic background transaction:', error);
      return handler();
    }
  }

  /**
   * Incrementa uma métrica de contador
   * 
   * Atalho para recordMetric com valor 1
   * 
   * @param name Nome da métrica
   * 
   * @example
   * ```typescript
   * this.newRelicService.incrementMetric('Custom/WorkOrders/Created');
   * this.newRelicService.incrementMetric('Custom/Emails/Sent');
   * ```
   */
  incrementMetric(name: string): void {
    this.recordMetric(name, 1);
  }

  /**
   * Obtém o trace.id da transação atual
   * 
   * Útil para logging manual ou correlação externa
   * 
   * @returns trace.id ou null se não houver transação ativa
   */
  getTraceId(): string | null {
    try {
      const metadata = newrelic.getTraceMetadata();
      return metadata.traceId || null;
    } catch (error) {
      console.error('Failed to get New Relic trace ID:', error);
      return null;
    }
  }

  /**
   * Obtém o span.id da transação atual
   * 
   * @returns span.id ou null se não houver transação ativa
   */
  getSpanId(): string | null {
    try {
      const metadata = newrelic.getTraceMetadata();
      return metadata.spanId || null;
    } catch (error) {
      console.error('Failed to get New Relic span ID:', error);
      return null;
    }
  }
}
