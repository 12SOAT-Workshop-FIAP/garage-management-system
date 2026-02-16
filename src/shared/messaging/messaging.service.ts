import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessagingService implements OnModuleInit {
  private readonly logger = new Logger(MessagingService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isConnected = false;

  async onModuleInit() {
    await this.connect();
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  private async connect() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      this.logger.log('Management System connected to RabbitMQ');

      this.connection.on('close', () => {
        this.isConnected = false;
        this.logger.warn('RabbitMQ connection closed. Reconnecting...');
        setTimeout(() => this.connect(), 5000);
      });

      this.connection.on('error', (err) => {
        this.isConnected = false;
        this.logger.error('RabbitMQ connection error:', err.message);
      });
    } catch (error) {
      this.isConnected = false;
      this.logger.error('Failed to connect to RabbitMQ:', error.message);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publish(routingKey: string, message: any): Promise<void> {
    if (!this.channel) {
      this.logger.error(`Cannot publish to "${routingKey}": RabbitMQ channel not available`);
      throw new Error(`RabbitMQ channel not available for publishing to "${routingKey}"`);
    }
    const exchange = 'garage-events';
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
  }

  async subscribe(queue: string, routingKey: string, handler: (msg: any) => void): Promise<void> {
    if (!this.channel) {
      this.logger.error(`Cannot subscribe to "${routingKey}": RabbitMQ channel not available`);
      return;
    }
    const exchange = 'garage-events';
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);

    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await handler(content);
          this.channel.ack(msg);
        } catch (error) {
          this.logger.error(`Error processing message from ${routingKey}:`, error.message);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }
}
