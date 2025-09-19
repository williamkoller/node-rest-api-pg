import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../../infra/monitoring/metricts.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {
    
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route?.path || 'unknown';

    return next.handle().pipe(
      tap((res) => {
        const status = res?.statusCode || res?.status || 200;

        this.metricsService.httpRequestCounter.inc({ method, route, status });
        this.metricsService.httpLatencyHistogram.observe(
          { method, route, status },
          (Date.now() - now) / 1000,
        );
      }),
    );
  }
}
