import { MetricCollectorService, SchemaDataType } from 'src/utils/metric-collector/metric-collector.service';
import { environments } from './../environment';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { CacheService, DataStore } from 'src/cache/cache.service';

const urlParser = require('url');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Rx = require('rxjs');

@Injectable()
export class UriProcService {

    private readonly logger = new Logger(UriProcService.name);

    constructor(private cacheService: CacheService,
                private httpService: HttpService,
                private metricCollector: MetricCollectorService) {
        this.cacheService.initMemoryCache(environments.urlCacheKey)
        this.metricCollector.setMetricSchema('hirana.tools.uriProcessor', { // tags:
            fetchType: ['fetch', 'wait-prefetch', 'cache'],
            error: ['yes', 'no'],
        },{ // Data of this request:
            origin: SchemaDataType.INTEGER
        });
    }

    public getDetailOf(url: string): Promise<{title: string, favicon: string, status: string}> {
        this.logger.log('Request URL data ' + urlParser.parse(url).hostname);
        return new Promise<{title: string, favicon: string, status: string}>((res, rej) => {
            const dataCached = this.getCache(url);
            if(dataCached?.status === 'fetching') {
                this.metricCollector.writeMetric('hirana.tools.uriProcessor', {
                    fetchType: 'wait-prefetch',
                    error: 'no'
                }, {
                    origin: urlParser.parse(url).hostname
                });
                dataCached.emitter.subscribe(r => {
                    res(r);
                });
            } else if(dataCached?.status === 'ok') {
                this.metricCollector.writeMetric('hirana.tools.uriProcessor', {
                    fetchType: 'cache',
                    error: 'no'
                }, {
                    origin: urlParser.parse(url).hostname
                });
                res(dataCached);
            } else {
                let nData = {
                    title: '',
                    favicon: '',
                    status: 'fetching',
                    emitter: Rx.Observable.create((observer) => {
                        this.httpService.get(url).subscribe(response => {
                            const dom = new JSDOM(response.data);
                            nData.title = dom.window.document.title;
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
                            nData.favicon = favicon;
                            nData.status = 'ok';
                            delete nData.emitter;
                            this.setCache(url, nData);
                            this.metricCollector.writeMetric('hirana.tools.uriProcessor', {
                                fetchType: 'fetch',
                                error: 'no'
                            }, {
                                origin: urlParser.parse(url).hostname
                            });
                            observer.next(nData);
                            observer.complete();
                        }, err => {
                            this.metricCollector.writeMetric('hirana.tools.uriProcessor', {
                                fetchType: 'fetch',
                                error: 'yes'
                            }, {
                                origin: urlParser.parse(url).hostname
                            });
                            this.logger.error('Error fetching: ' + url, err);
                            nData.status = 'failed';
                            delete nData.emitter;
                            this.setCache(url, nData);
                            observer.error();
                        });
                    })
                };
                nData.emitter.subscribe(d => {
                    res(d);
                }, err => {
                    rej(err);
                });
                this.setCache(url, nData);
            }
        });
    }

    private getCache(key: string) {
        return this.cacheService.getCache(environments.urlCacheKey, key);
    }

    private setCache(key: string, data: any) {
        this.cacheService.setCache(environments.urlCacheKey, new DataStore(
            key,
            data
        ))
    }

}
