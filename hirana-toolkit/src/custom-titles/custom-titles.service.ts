import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class CustomTitlesService {

    constructor(private storageSrv: StorageService) {
        this.storageSrv.init('global-custom');
        this.storageSrv.init('rangos-custom');
    }

    getGlobalCustom(user: string) {
        return this.storageSrv.get('global-custom').values[user];
    }

    getChannelCustom(channel: string, user: string) {
        if(this.storageSrv.get('rangos-custom').values[channel]) {
            return this.storageSrv.get('rangos-custom').values[channel][user];
        } else {
            return undefined;
        }
    }

}
