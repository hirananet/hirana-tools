import { MetricCollectorService, SchemaDataType } from 'src/utils/metric-collector/metric-collector.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('metric-test')
export class MetricTestController {

    constructor(private metricCollector: MetricCollectorService) {
        this.metricCollector.setMetricSchema('metric-test', { // tags:
            status: ['ok', 'nok']
        },{ // Data of this request:
            response: SchemaDataType.STRING
        });
    }

    @Post()
    writeMetric(@Body() tags) {
        this.metricCollector._writeMetric('metric-test', tags);
        return '"DONE"';
    }

    @Get() 
    writeMetricAlt() {
        this.metricCollector._writeMetric('metric-test', {
            status: Math.random() > 0.5 ? 'ok' : 'nok'
        }, {
            response: 'DONE'
        });
        return '"DONE"';
    }

}
