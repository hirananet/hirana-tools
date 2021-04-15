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
            this.esclient.index({
                index: metricName,
                type: '_doc',
                body: tags,
                timestamp: new Date()
            });
        } catch(err) {
            this.logger.error('Can\t write metric', err);
        }
    }

}
