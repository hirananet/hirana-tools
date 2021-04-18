import { Injectable } from '@nestjs/common';
const Influxdb = require('influxdb-v2');

@Injectable()
export class MetricCollectorService {

    private static readonly metricCollectorCFG = {
        host: process.env.METRIC_COLLECTOR_HOST ? process.env.METRIC_COLLECTOR_HOST : 'srv-captain--metric-collector',
        protocol: process.env.METRIC_COLLECTOR_SSL ? 'https' : 'http',
        port: process.env.METRIC_COLLECTOR_PORT ? process.env.METRIC_COLLECTOR_PORT : 8086,
        token: process.env.METRIC_COLLECTOR_TOKEN ? process.env.METRIC_COLLECTOR_TOKEN : '8fd19e38d9167b2a1e94fb85',
        org: process.env.METRIC_COLLECTOR_ORG ? process.env.METRIC_COLLECTOR_ORG : 'thirdfloor',
        bucket: process.env.METRIC_COLLECTOR_BUCKET ? process.env.METRIC_COLLECTOR_BUCKET : 'tools-core',
    };

    private readonly influxDB;

    constructor() {
        this.influxDB = new Influxdb({
            host: MetricCollectorService.metricCollectorCFG.host,
            protocol: MetricCollectorService.metricCollectorCFG.protocol,
            port: MetricCollectorService.metricCollectorCFG.port,
            token: MetricCollectorService.metricCollectorCFG.token
        });
    }

    public writeMetric(key: string, fields: {[key: string]: any}, tags?: {[key: string]: string}) {
        this.influxDB.write({
            org: MetricCollectorService.metricCollectorCFG.org,
            bucket: MetricCollectorService.metricCollectorCFG.bucket,
            precision: 'ms'
        },
        [{
            measurement: key,
            tags: tags,
            fields: fields,
            timestamp: Date.now()
        }]);
    }

}
