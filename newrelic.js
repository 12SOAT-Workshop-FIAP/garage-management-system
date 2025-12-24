'use strict';

/**
 * New Relic Agent Configuration
 * 
 * Este arquivo configura o agente New Relic para monitoramento APM.
 * As configurações são complementares à auto-instrumentação do Kubernetes Operator.
 */

exports.config = {
  /**
   * Nome da aplicação no New Relic
   * Pode ser sobrescrito pela variável de ambiente NEW_RELIC_APP_NAME
   */
  app_name: [process.env.NEW_RELIC_APP_NAME || 'garage-api'],

  /**
   * License Key do New Relic
   * IMPORTANTE: Injetada automaticamente pelo Kubernetes Operator
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * Distributed Tracing
   * Rastreia requisições através de múltiplos serviços
   */
  distributed_tracing: {
    enabled: true,
  },

  /**
   * Configuração de Logging
   */
  logging: {
    /**
     * Nível de log do agente New Relic
     * Opções: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
     */
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
    
    /**
     * Onde o agente deve escrever logs
     * 'stdout' envia para console (capturado pelo Fluent Bit)
     */
    filepath: 'stdout',
    
    enabled: true,
  },

  /**
   * Application Logging
   * Integração entre logs da aplicação e traces do APM
   */
  application_logging: {
    enabled: true,
    
    /**
     * Forwarding: Envia logs diretamente para New Relic Logs
     */
    forwarding: {
      enabled: true,
      max_samples_stored: 10000,
    },
    
    /**
     * Metrics: Cria métricas baseadas em logs
     */
    metrics: {
      enabled: true,
    },
    
    /**
     * Local Decorating: Adiciona trace.id e span.id aos logs
     * Permite correlação entre logs e traces
     */
    local_decorating: {
      enabled: true,
    },
  },

  /**
   * Transaction Tracer
   * Configurações de rastreamento de transações
   */
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
    explain_threshold: 500,
  },

  /**
   * Error Collector
   * Captura e reporta erros
   */
  error_collector: {
    enabled: true,
    ignore_status_codes: [404],
  },

  /**
   * Slow SQL
   * Rastreia queries SQL lentas
   */
  slow_sql: {
    enabled: true,
  },

  /**
   * Custom Insights Events
   * Permite criar eventos customizados
   */
  custom_insights_events: {
    enabled: true,
    max_samples_stored: 10000,
  },

  /**
   * Atributos customizados globais
   * Adicionados a todas as transações e eventos
   */
  attributes: {
    enabled: true,
    include: [
      'request.parameters.*',
      'request.headers.user-agent',
    ],
  },
};
