import { environments } from 'src/environment';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';
import * as InfluxDB from 'influxdb-nodejs';
import { of } from 'rxjs';
import { exception } from 'console';


@Injectable()
export class MetricCollectorService {

    private readonly logger = new Logger(MetricCollectorService.name);

    private readonly esclient: elasticsearch.Client;
    private readonly influx;
    private schemas: {[key: string]: boolean} = {};

    private readonly metricType = environments.metricType;

    constructor() {
        this.esclient = new elasticsearch.Client({
            host: environments.elasticHOST,
            deadTimeout: 3000,
            maxRetries: 5
        });
        this.esclient.ping({ requestTimeout: 3000 }).then(() => {

        })
        .catch(err => { 
            this.logger.error('Unable to reach Elasticsearch cluster', err);
        });
        
        this.influx = new InfluxDB('http://hirana-write:hirana-write_password@srv-captain--hirana-tools-idb-db:8086/hirana-db');
    }

    public writeMetric(metricName: string, tags: {[key: string]: any}) {
        try {
            const date = new Date();
            const YYYY = date.getUTCFullYear();
            const MM = (date.getUTCMonth()+1) > 9 ? (date.getUTCMonth()+1) : '0' + (date.getUTCMonth()+1);
            const DD = date.getUTCDate() > 9 ? date.getUTCDate() : '0' + date.getUTCDate();
            let HH = '';
            if(this.metricType == 'HOURLY') {
                HH = '.'+(date.getUTCHours() > 9 ? date.getUTCHours() : '0' + date.getUTCHours());
            }
            tags.properties = {
                serverDate: {
                    type: "date",
                    index: "true",
                    format: "strict_date_optional_time||epoch_millis"
                }
            };
            tags.serverDate = date.toISOString();
            this.esclient.index({
                index: metricName+'-'+YYYY+'.'+MM+'.'+DD+HH,
                type: '_doc',
                body: tags,
            });
        } catch(err) {
            this.logger.error('Can\t write metric', err);
        }
    }

    public setMetricSchema(metricName: string, tags: {[key: string]: string[] | '*'}, fields: {[key:string]: SchemaDataType}) {
        this.schemas[metricName] = true;
        this.influx.schema(metricName, fields, tags, {
            stripUnknown: true
        });
    }

    public _writeMetric(metricName: string, tags: {[key: string]: any}, fields?: {[key: string]: any}): void {
        if(!this.schemas[metricName]) throw 'INVALID METRIC NAME, NO SCHEMA SETTED.';
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