import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

/**
 * Winston Logger Service integrado com New Relic
 * 
 * Este logger:
 * - Escreve logs estruturados em JSON
 * - Adiciona automaticamente trace.id e span.id (correlação com APM)
 * - Envia logs para stdout (capturados pelo Fluent Bit)
 * - Permite criar eventos de negócio customizados
 * 
 * @example
 * ```typescript
 * constructor(private readonly logger: WinstonLoggerService) {}
 * 
 * this.logger.log('Order created', 'WorkOrderService', { orderId: '123' });
 * this.logger.logBusinessEvent('work_order_created', { orderId: '123', value: 1500 });
 * ```
 */
@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;
  private context?: string;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: {
        service: 'garage-api',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [
        // Em produção (Kubernetes), usa JSON puro para New Relic capturar
        new winston.transports.Console(),
      ],
    });
  }

  /**
   * Define o contexto para todos os logs subsequentes
   * Útil para identificar de qual classe/módulo vem o log
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * Log de nível INFO
   */
  log(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.info(message, {
      context: context || this.context,
      ...metadata,
    });
  }

  /**
   * Log de nível ERROR
   */
  error(message: string, trace?: string, context?: string, metadata?: Record<string, any>) {
    this.logger.error(message, {
      context: context || this.context,
      trace,
      ...metadata,
    });
  }

  /**
   * Log de nível WARN
   */
  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.warn(message, {
      context: context || this.context,
      ...metadata,
    });
  }

  /**
   * Log de nível DEBUG
   */
  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.debug(message, {
      context: context || this.context,
      ...metadata,
    });
  }

  /**
   * Log de nível VERBOSE
   */
  verbose(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.verbose(message, {
      context: context || this.context,
      ...metadata,
    });
  }

  /**
   * Log de evento de negócio customizado
   * 
   * Use este método para registrar eventos importantes do domínio
   * que você quer rastrear em dashboards do New Relic
   * 
   * @example
   * ```typescript
   * this.logger.logBusinessEvent('work_order_created', {
   *   orderId: '123',
   *   customerId: 'customer-456',
   *   totalValue: 1500.00,
   *   serviceCount: 3
   * });
   * ```
   */
  logBusinessEvent(eventName: string, data: Record<string, any>) {
    this.logger.info(eventName, {
      eventType: 'business',
      eventName,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  /**
   * Log de métrica customizada
   * 
   * Use para registrar valores numéricos que você quer agregar
   * 
   * @example
   * ```typescript
   * this.logger.logMetric('order_processing_time', 1234, { orderId: '123' });
   * ```
   */
  logMetric(metricName: string, value: number, metadata?: Record<string, any>) {
    this.logger.info(`Metric: ${metricName}`, {
      eventType: 'metric',
      metricName,
      metricValue: value,
      ...metadata,
    });
  }

  /**
   * Log de performance
   * 
   * Use para medir tempo de execução de operações
   * 
   * @example
   * ```typescript
   * const startTime = Date.now();
   * // ... operação
   * this.logger.logPerformance('calculate_total', Date.now() - startTime, { orderId: '123' });
   * ```
   */
  logPerformance(operation: string, durationMs: number, metadata?: Record<string, any>) {
    this.logger.info(`Performance: ${operation}`, {
      eventType: 'performance',
      operation,
      durationMs,
      ...metadata,
    });
  }
}
