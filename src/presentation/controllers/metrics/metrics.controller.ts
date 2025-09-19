import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from '../../../infra/monitoring/metricts.service';
import type { Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.metrics.getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  }
}
