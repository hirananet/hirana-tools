import { environments } from 'src/environment';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';


@Injectable()
export class MetricCollectorService {

    private readonly logger = new Logger(MetricCollectorService.name);

    private readonly esclient: elasticsearch.Client;

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

}
