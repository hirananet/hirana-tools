import { environments } from 'src/environment';
import { CacheRedisService } from './../utils/core-utils/cache-redis/cache-redis.service';
import { KVSService } from './../utils/core-utils/kvs/kvs.service';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { MetricCollectorService } from 'src/utils/core-utils/metric-collector/metric-collector.service';

const fs = require('fs');

@Injectable()
export class AvatarService {

    private readonly logger = new Logger(AvatarService.name);

    constructor(
        private kvsSrv: KVSService,
        private cacheSrv: CacheRedisService,
        private metricCollector: MetricCollectorService,
        private httpService: HttpService
    ) { }

    async getAvatarOfUser(nick: string): Promise<{type, body}> {
        return new Promise<{type: string, body: any}>(async (res, rej) => {
            const cache = await this.cacheSrv.getFromCache('cache-avatar-'+nick, true);
            if(cache) {
                this.metricCollector.writeMetric('avatar-service', {
                    type: cache.tdata,
                    size: cache.bdata.length
                }, {
                    status: 'cached'
                });
                return {
                    type: cache.tdata,
                    body: cache.bdata
                }
            }

            // este usuario tiene un avatar?:
            const savedUser = await this.kvsSrv.get('avatar-' + nick, true);
            if(savedUser) {
                this.logger.error('Svd usr: ' + JSON.stringify(savedUser) + savedUser)
                this.httpService.get(savedUser.url, {
                    responseType: 'arraybuffer'
                }).subscribe(d => {
                    const image = d.data;
                    this.metricCollector.writeMetric('avatar-service', {
                        type: savedUser.tdata,
                        size: image?.length ? image.length : 0
                    }, {
                        status: 'fetched'
                    });
                    this.cacheSrv.saveInCache('cache-avatar-'+nick, environments.avatarTTL, {
                        tdata: savedUser.tdata,
                        bdata: image
                    });
                    res({
                        type: savedUser.type ? savedUser.type : 'image/png',
                        body: image
                    });
                }, e => {
                    this.metricCollector.writeMetric('avatar-service', {
                        type: savedUser.tdata,
                        host: (new URL(savedUser.url)).hostname
                    }, {
                        status: 'fetched-error'
                    });
                    this.logger.error('Error getting avatar of: '+nick+' in url: ' + savedUser.url, e);
                    res(this.getDefault());
                });
            }

            // JDENTICON
            const avatarURL = 'https://avatars.dicebear.com/api/jdenticon/' + nick + '.svg?options[colorful]=1';
            this.httpService.get(avatarURL, {
                responseType: 'text'
            }).subscribe(d => {
                this.cacheSrv.saveInCache('cache-avatar-'+nick, environments.jdenticonTTL, {
                    tdata: 'image/svg+xml',
                    bdata: d.data
                });
                this.metricCollector.writeMetric('avatar-service', {
                    size: d.data.length
                }, {
                    status: 'jdenticon-generated'
                });
                res({
                    type: 'image/svg+xml',
                    body: d.data
                });
            }, e => {
                this.metricCollector.writeMetric('avatar-service', {
                    nick
                }, {
                    status: 'jdenticon-error'
                });
                this.logger.error('Error getting JDenticon of: '+nick+' in url: ' + avatarURL, e);
                res(this.getDefault());
            });

        });
    }

    private getDefault() {
        return {
            type: 'image/png',
            body: fs.readFileSync(environments.resourcesLocation + '/default.png')
        }
    }

}
