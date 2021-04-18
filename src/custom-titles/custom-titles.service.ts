import { KVSService } from './../utils/core-utils/kvs/kvs.service';
import { Injectable } from '@nestjs/common';
import { environments } from 'src/environment';

@Injectable()
export class CustomTitlesService {

    constructor(private kvsSrv: KVSService) { }

    getGlobalCustom(user: string) {
        return this.kvsSrv.get('globaltitle-'+user, true);
    }

    getChannelCustom(channel: string, user: string) {
        return this.kvsSrv.get('customtitle-'+channel+'-'+user, true);
    }

}
