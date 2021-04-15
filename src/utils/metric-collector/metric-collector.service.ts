import { environments } from 'src/environment';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';


@Injectable()
export class MetricCollectorService {

    private readonly logger = new Logger(MetricCollectorService.name);

    private readonly esclient: elasticsearch.Client;

    constructor() {
        this.esclient = new elasticsearch.Client({
            host: environments.elasticHOST,
            deadTimeout: 3000,
            maxRetries: 5
        });
        this.esclient.ping({ requestTimeout: 3000 })
        .catch(err => { 
            this.logger.error('Unable to reach Elasticsearch cluster', err);
         });
    }

    public writeMetric(metricName: string, tags: {[key: string]: string}) {
        try {
            const date = new Date();
            const YYYY = date.getFullYear();
            const MM = (date.getMonth()+1) > 9 ? (date.getMonth()+1) : '0' + (date.getMonth()+1);
            const DD = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
            const HH = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
            this.esclient.index({
                index: metricName+'-'+YYYY+'.'+MM+'.'+DD+'.'+HH,
                type: '_doc',
                body: tags
            });
        } catch(err) {
            this.logger.error('Can\t write metric', err);
        }
    }

}
