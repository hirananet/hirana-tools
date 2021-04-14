import { environments } from 'src/environment';
import { HttpException, Injectable } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';


@Injectable()
export class MetricCollectorService {

    private readonly esclient: elasticsearch.Client;

    constructor() {
        this.esclient = new elasticsearch.Client({
            host: environments.elasticHOST
        });
        this.esclient.ping({ requestTimeout: 3000 })
        .catch(err => { 
            throw new HttpException({
                status: 'error',
                message: 'Unable to reach Elasticsearch cluster'
             }, 500); 
         });
    }

    public writeMetric(metricName: string, tags: {[key: string]: string}) {
        this.esclient.index({
            index: metricName,
            type: '_doc',
            body: tags
        });
    }

}
