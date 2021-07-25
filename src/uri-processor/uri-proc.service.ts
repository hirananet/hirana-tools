import { MetricCollectorService } from 'src/utils/core-utils/metric-collector/metric-collector.service';
import { PublisherService } from './../utils/core-utils/publisher/publisher.service';
import { SubscriberService } from './../utils/core-utils/subscriber/subscriber.service';
import { environments } from 'src/environment';
import { CacheRedisService } from './../utils/core-utils/cache-redis/cache-redis.service';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { first } from 'rxjs/operators';

const urlParser = require('url');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const ogs = require('open-graph-scraper');
const options = { url: 'http://ogp.me/' };

@Injectable()
export class UriProcService {

    private readonly logger = new Logger(UriProcService.name);

    constructor(private httpService: HttpService,
                private cacheSrv: CacheRedisService,
                private subSrv: SubscriberService,
                private pubSrv: PublisherService,
                private metricCollector: MetricCollectorService) {
        this.subSrv.attach('url-processed').subscribe((d) => {

        })
    }

    public getDetailOf(url: string): Promise<{title: string, favicon: string, status: string}> {
        this.logger.log('Request URL data ' + urlParser.parse(url).hostname);
        return new Promise<{title: string, favicon: string, status: string}>(async (res, rej) => {
            const urlChecksum = this.cacheSrv.checksum(url);
            const cache = await this.cacheSrv.getFromCache('url-'+urlChecksum, true);

            if(cache) {
                if(cache.ready) {
                    this.metricCache('cached', urlChecksum, url);
                    res(cache);
                } else {
                    this.logger.debug('Waiting previous transaction: ' + urlChecksum + '' + url);
                    this.metricCache('waiting', urlChecksum, url);
                    // wait for ready cache.
                    this.subSrv.getSubscription('url-processed').pipe(first()).subscribe(async (d: any) => {
                        if(d.hash == urlChecksum) {
                            if(d.resolved) {
                                this.metricCache('wait-resolved', urlChecksum, url);
                                this.logger.debug('Resolved transaction: ' + urlChecksum + '' + url);
                                res(await this.cacheSrv.getFromCache('url-'+urlChecksum, true));
                            } else {
                                this.metricCache('wait-error', urlChecksum, url);
                                this.logger.error('Failed async transaction: ' + urlChecksum + '' + url);
                                rej('fail async-fetch.');
                            }
                        }
                    });
                }
            } else {
                const data = {
                    title: '',
                    favicon: '',
                    status: 'fetching',
                    ready: false
                };
                this.logger.debug('Fetching: ' + urlChecksum + '' + url);
                // send to cache
                const cached = this.cacheSrv.saveInCache('url-'+urlChecksum, environments.urlTTL, data);
                // get data
                this.metricCache('fetched', urlChecksum, url);
                ogs({url: url})
                    .then((data) => {
                        const { error, result, response } = data;
                        if(!error) {
                        //https://github.com/jshemas/openGraphScraper#results-json
                            data.title = result.ogTitle;
                            data.favicon = result.ogImage.url;
                            data.ready = true;
                            const updated = this.cacheSrv.saveInCache('url-'+urlChecksum, environments.urlTTL, data);
                            if(updated) {
                                this.pubSrv.publish('url-processed', {
                                    hash: urlChecksum,
                                    resolved: true
                                });
                            } else {
                                this.logger.error('Fail update: ' + urlChecksum + '' + url);
                                this.pubSrv.publish('url-processed', {
                                    hash: urlChecksum,
                                    resolved: false
                                });
                            }
                            res(data);
                        } else {
                            this.metricCache('fetch-error', urlChecksum, url);
                            this.logger.error('Not fetched: ' + urlChecksum + '' + url);
                            if(cached) {
                                this.cacheSrv.invalidate('url-'+urlChecksum);
                                this.pubSrv.publish('url-processed', {
                                    hash: urlChecksum,
                                    resolved: false
                                });
                            }
                            rej('fail fetch.');
                        }
                    })
            }
        });
    }

    private metricCache(status: string, checksum: string, url: string) {
        this.metricCollector.writeMetric('uri-processor', {
            checksum,
            host: (new URL(url)).hostname
        }, {
            status
        })
    }

}
