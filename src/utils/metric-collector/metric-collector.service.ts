import { environments } from 'src/environment';
import { Injectable, Logger } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';
import * as InfluxDB from 'influxdb-nodejs';

const AppMetrics = require('appmetrics');

@Injectable()
export class MetricCollectorService {

    private readonly logger = new Logger(MetricCollectorService.name);

    private readonly esclient: elasticsearch.Client;
    private readonly influx;
    private schemas: {[key: string]: boolean} = {};
    private readonly metricID = environments.appMetricID;

    constructor() {
        this.influx = new InfluxDB(environments.influxDB);
        this.globalMetrics(AppMetrics.monitor());
    }

    globalMetrics(monitoring) {
        this.setMetricSchema('requirements', {
            type: ['cpu', 'memory']
        },{
            used: SchemaDataType.FLOAT,
            total_used: SchemaDataType.FLOAT,
            free: SchemaDataType.FLOAT
        })
        monitoring.on('cpu', (cpu) => {
            const used = cpu.process;
            const total_used = cpu.system;
            this.writeMetric('requirements', {type: 'cpu'}, {
                used,
                total_used
            });
        });
        monitoring.on('memory', (cpu) => {
            const used = cpu.physical;
            const total_used = cpu.physical_used;
            const free = cpu.physical_free;
            this.writeMetric('requirements', {type: 'cpu'}, {
                used,
                total_used,
                free
            });
        });
    }

    public setMetricSchema(metricName: string, tags: {[key: string]: string[] | '*'}, fields: {[key:string]: SchemaDataType}) {
        metricName = this.metricID + '.' + metricName;
        this.schemas[metricName] = true;
        this.influx.schema(metricName, fields, tags, {
            stripUnknown: true
        });
    }

    public writeMetric(metricName: string, tags: {[key: string]: any}, fields: {[key: string]: any}): void {
        metricName = this.metricID + '.' + metricName;
        if(!this.schemas[metricName]) { 
            this.logger.error('INVALID METRIC NAME, NO SCHEMA SETTED: ' + metricName, 'METRIC-COLLECTOR');
            return;
        }
        const writeObj = this.influx.write(metricName).tag(tags);
        if(fields) {
            writeObj.field(fields);
        }
        writeObj.then(() => {
            this.logger.debug('Logged ok metric: '+metricName);
        }).catch(e => {
            this.logger.error('Error logging metric: '+metricName, e);
        });
    }

}

export enum SchemaDataType {
    INTEGER = 'i',
    STRING = 's',
    FLOAT = 'f',
    BOOLEAN = 'b'
}