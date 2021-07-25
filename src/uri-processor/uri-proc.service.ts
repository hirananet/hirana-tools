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
                this.httpService.get(url, {headers: {'User-Agent': environments.userAgent}, responseType: 'document'}).subscribe(response => {
                    this.logger.debug('Fetched: ' + urlChecksum + '' + url);
                    this.metricCache('fetched', urlChecksum, url);
                    const dom = new JSDOM(response.data);
                    data.title = dom.window.document.title;
                    const tq = dom.window.document.head.querySelector('link[rel=icon]');
                    let favicon =  tq ? tq.href : undefined;
                    if(!favicon) {
                        const tq2 = dom.window.document.head.querySelector('link[rel="shortcut icon"]');
                        favicon = tq2 ? tq2.href : undefined;
                    }
                    const urlParsed = urlParser.parse(url);
                    const urlBase = urlParsed.protocol + '//' + urlParsed.host;
                    if (favicon && favicon.indexOf('http') != 0) {
                        favicon = favicon[0] == '/' ? urlBase + favicon : urlBase + '/' + favicon;
                    }
                    data.favicon = favicon;
                    data.ready = true;
                    if(cached) {
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
                    }
                    res(data);
                }, err => {
                    this.metricCache('fetch-error', urlChecksum, url);
                    this.logger.error('Not fetched: ' + urlChecksum + '' + url);
                    this.logger.error(err);
                    if(cached) {
                        this.cacheSrv.invalidate('url-'+urlChecksum);
                        this.pubSrv.publish('url-processed', {
                            hash: urlChecksum,
                            resolved: false
                        });
                    }
                    rej('fail fetch.');
                });
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
