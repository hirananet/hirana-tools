import { Injectable } from '@nestjs/common';
import { environments } from 'src/environment';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class CustomTitlesService {

    constructor(private storageSrv: StorageService) {
        this.storageSrv.init(environments.gcStorageKey);
        this.storageSrv.init(environments.rcStorageKey);
    }

    getGlobalCustom(user: string) {
        return this.storageSrv.get(environments.gcStorageKey).values[user];
    }

    getChannelCustom(channel: string, user: string) {
        if(this.storageSrv.get(environments.rcStorageKey).values[channel]) {
            return this.storageSrv.get(environments.rcStorageKey).values[channel][user];
        } else {
            return undefined;
        }
    }

}
