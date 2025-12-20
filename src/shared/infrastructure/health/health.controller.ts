import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NewRelicService } from '../new-relic.service';
import { IsPublic } from '@modules/auth/presentation/decorators/is-public.decorator';


@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly newRelic: NewRelicService,
  ) {}


  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        database: { type: 'string', example: 'connected' },
        timestamp: { type: 'string', example: '2025-12-18T21:25:00.000Z' },
        uptime: { type: 'number', example: 3600 },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is unhealthy',
  })
  async check(): Promise<{
    status: string;
    database: string;
    timestamp: string;
    uptime: number;
  }> {
    const startTime = Date.now();

    try {
      const isDatabaseConnected = this.dataSource.isInitialized;
      
      if (!isDatabaseConnected) {
        throw new Error('Database not connected');
      }

      await this.dataSource.query('SELECT 1');

      const duration = Date.now() - startTime;

      this.newRelic.recordMetric('Custom/Health/Check', 1);
      this.newRelic.recordMetric('Custom/Health/CheckDuration', duration);

      this.newRelic.recordEvent('HealthCheckSuccess', {
        timestamp: new Date().toISOString(),
        durationMs: duration,
        database: 'connected',
      });

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    } catch (error) {
      const err = error as Error;
      
      this.newRelic.noticeError(err, {
        healthcheck: 'failed',
        database: 'disconnected',
      });

      this.newRelic.recordEvent('HealthCheckFailure', {
        timestamp: new Date().toISOString(),
        error: err.message,
        database: 'disconnected',
      });

      throw new Error('Health check failed: Database connection error');
    }
  }
}
