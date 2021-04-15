import { MetricCollectorService } from 'src/utils/metric-collector/metric-collector.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('metric-test')
export class MetricTestController {

    constructor(private metricCollector: MetricCollectorService) { }

    @Post()
    writeMetric(@Body() tags) {
        this.metricCollector.writeMetric('metric-test', tags);
    }

}
