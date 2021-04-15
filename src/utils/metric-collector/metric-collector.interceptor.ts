import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MetricCollectorService, SchemaDataType } from './metric-collector.service';

@Injectable()
export class MetricCollectorInterceptor implements NestInterceptor {

  constructor(private metricCollector: MetricCollectorService) {
    this.metricCollector.setMetricSchema('http', {
      method: ['GET','POST','PUT','DELETE'],
      status: ['10x','20x','30x','40x','50x','60x','70x','80x','90x']
    }, {
      endpoint: SchemaDataType.STRING
    })
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const resp = httpContext.getResponse();
    console.log('responding', resp);
    this.metricCollector.writeMetric('http', {
      method: req.method,
      status: Math.floor(resp.status()/10) + 'x'
    },{
      endpoint: req.url
    })
    return next.handle();
  }
}