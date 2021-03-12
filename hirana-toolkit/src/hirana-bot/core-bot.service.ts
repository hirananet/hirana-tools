import { environments } from './../environment';
import { Injectable } from '@nestjs/common';
import * as NodeIRC from 'irc';

@Injectable()
export class CoreBotService {

    private client: NodeIRC.Client;

    constructor() {
        if(environments.bot.enabled) {
            this.client = new NodeIRC.Client(environments.bot.server, environments.bot.botName, {
                channels: environments.bot.channels
            });
            this.init();
        }
    }

    private init() {
        // attach bot events.
    }
}
