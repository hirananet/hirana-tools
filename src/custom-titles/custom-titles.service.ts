import { KVSService } from './../utils/core-utils/kvs/kvs.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomTitlesService {

    constructor(private kvsSrv: KVSService) { }

    getGlobalCustom(user: string) {
        user = user.toLocaleLowerCase();
        return this.kvsSrv.get('globaltitle-'+user, true);
    }

    getChannelCustom(channel: string, user: string) {
        user = user.toLocaleLowerCase();
        return this.kvsSrv.get('customtitle-'+channel+'-'+user, true);
    }

}
