import { Module } from '@nestjs/common';
import { MetricsController } from '../../controllers/metrics/metrics.controller';
import { MetricsService } from '../../../infra/monitoring/metricts.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsInterceptor } from '../../../shared/interceptors/metrics.interceptor';

@Module({
  controllers: [MetricsController],
  providers: [
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
