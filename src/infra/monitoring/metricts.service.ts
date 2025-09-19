import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Registry,
  Counter,
  Histogram,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  public httpRequestCounter: Counter<string>;
  public httpLatencyHistogram: Histogram<string>;
  private readonly registry = new Registry();

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.httpLatencyHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Request duration in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.registry.registerMetric(this.httpRequestCounter);
    this.registry.registerMetric(this.httpLatencyHistogram);
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
