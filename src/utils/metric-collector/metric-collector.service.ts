import { environments } from 'src/environment';
import { Injectable, Logger } from '@nestjs/common';
import * as InfluxDB from 'influxdb-nodejs';

@Injectable()
export class MetricCollectorService {

    private readonly logger = new Logger(MetricCollectorService.name);

    private readonly influx;
    private schemas: {[key: string]: boolean} = {};
    private readonly metricID = environments.appMetricID;

    constructor() {
        this.influx = new InfluxDB(environments.influxDB);
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