import { environments } from './../environment';
import { StorageService } from './../storage/storage.service';
import { CacheService } from './../cache/cache.service';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { MetricCollectorService, SchemaDataType } from 'src/utils/metric-collector/metric-collector.service';
const fs = require('fs');

@Injectable()
export class AvatarService {

    private readonly logger = new Logger(AvatarService.name);

    constructor(
        private cacheService: CacheService,
        private storageService: StorageService,
        private httpService: HttpService,
        private metricCollector: MetricCollectorService
    ) {
        this.storageService.init(environments.avatarStorageKey);
        this.cacheService.initMemoryCache(environments.avatarStorageKey);
        this.metricCollector.setMetricSchema('hirana.tools.getAvatar', { // tags:
            inCache: ['yes', 'no'],
            stored: ['yes', 'no', 'n/a'],
            error: ['yes', 'no'],
        },{ // Data of this request:
            fileSize: SchemaDataType.INTEGER,
            fileType: SchemaDataType.STRING
        });
    }

    getAvatarOfUser(nick: string): Promise<{type, body}> {
        return new Promise<{type: string, body: any}>((res, rej) => {
            // tengo cacheado el avatar?
            if(this.getCache(nick)) {
                const userAvatar = this.getCache(nick);
                this.metricCollector.writeMetric('hirana.tools.getAvatar', {inCache: 'yes', stored: 'n/a', error: 'no'}, {fileSize: userAvatar.bdata.length, fileType: userAvatar.tdata});
                res({
                    type: userAvatar.tdata,
                    body: userAvatar.bdata
                });
            } else {
                // tiene registrado un avatar?
                if(this.getStorage().values[nick]) {
                    const user = this.getStorage().values[nick];
                    const url = user.url ? user.url : user;
                    this.httpService.get(url, {
                        responseType: 'arraybuffer'
                    }).subscribe(d => {
                        this.metricCollector.writeMetric('hirana.tools.getAvatar', {inCache: 'no', stored: 'yes', error: 'no'}, {fileSize: user.data.length, fileType: user.type});
                        this.setCache(nick, {
                            tdata: user.type ? user.type : 'image/png',
                            bdata: d.data
                        });
                        res({
                            type: user.type ? user.type : 'image/png',
                            body: d.data
                        });
                    }, e => {
                        this.metricCollector.writeMetric('hirana.tools.getAvatar', {inCache: 'no', stored: 'yes', error: 'yes'}, {fileSize: user.data.length, fileType: user.type});
                        this.logger.error('Error getting avatar of: '+nick+' in url: ' + url, e);
                        res(this.getDefault());
                    });
                } else {
                    const avatarURL = 'https://avatars.dicebear.com/api/jdenticon/' + nick + '.svg?options[colorful]=1';
                    this.httpService.get(avatarURL, {
                        responseType: 'text'
                    }).subscribe(d => {
                        this.metricCollector.writeMetric('hirana.tools.getAvatar', {inCache: 'no', stored: 'no', error: 'no'}, {fileSize: d.data.length, fileType: 'JDENTICON'});
                        this.setCache(nick, {
                            tdata: 'image/svg+xml',
                            bdata: d.data
                        });
                        res({
                            type: 'image/svg+xml',
                            body: d.data
                        });
                    }, e => {
                        this.metricCollector.writeMetric('hirana.tools.getAvatar', {inCache: 'no', stored: 'no', error: 'yes'}, {fileSize: 0, fileType: 'JDENTICON'});
                        this.logger.error('Error getting JDenticon of: '+nick+' in url: ' + avatarURL, e);
                        res(this.getDefault());
                    });
                }
            }
        });
    }

    private getDefault() {
        return {
            type: 'image/png',
            body: fs.readFileSync(environments.resourcesLocation + '/default.png')
        }
    }

    private getCache(key: string) {
        return this.cacheService.getCache(environments.avatarStorageKey, key);
    }

    private setCache(key: string, data: any) {
        this.cacheService.setCache(environments.avatarStorageKey, {
            key,
            data
        });
    }

    private getStorage() {
        return this.storageService.get(environments.avatarStorageKey);
    }

}
