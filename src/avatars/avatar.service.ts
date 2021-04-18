import { environments } from './../environment';
import { StorageService } from './../storage/storage.service';
import { CacheService } from './../cache/cache.service';
import { HttpService, Injectable, Logger } from '@nestjs/common';
const fs = require('fs');

@Injectable()
export class AvatarService {

    private readonly logger = new Logger(AvatarService.name);

    constructor(
        private cacheService: CacheService,
        private storageService: StorageService,
        private httpService: HttpService
    ) {
        this.storageService.init(environments.avatarStorageKey);
        this.cacheService.initMemoryCache(environments.avatarStorageKey);
    }

    getAvatarOfUser(nick: string): Promise<{type, body}> {
        return new Promise<{type: string, body: any}>((res, rej) => {
            // tengo cacheado el avatar?
            if(this.getCache(nick)) {
                const userAvatar = this.getCache(nick);
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
                        this.setCache(nick, {
                            tdata: user.type ? user.type : 'image/png',
                            bdata: d.data
                        });
                        res({
                            type: user.type ? user.type : 'image/png',
                            body: d.data
                        });
                    }, e => {
                        this.logger.error('Error getting avatar of: '+nick+' in url: ' + url, e);
                        res(this.getDefault());
                    });
                } else {
                    const avatarURL = 'https://avatars.dicebear.com/api/jdenticon/' + nick + '.svg?options[colorful]=1';
                    this.httpService.get(avatarURL, {
                        responseType: 'text'
                    }).subscribe(d => {
                        this.setCache(nick, {
                            tdata: 'image/svg+xml',
                            bdata: d.data
                        });
                        res({
                            type: 'image/svg+xml',
                            body: d.data
                        });
                    }, e => {
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
