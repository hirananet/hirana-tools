import { KVSService } from './../utils/core-utils/kvs/kvs.service';
import { CacheRedisService } from './../utils/core-utils/cache-redis/cache-redis.service';
import { environments } from 'src/environment';
import { Injectable, Logger } from '@nestjs/common';
import * as NodeIRC from 'irc';

@Injectable()
export class CoreBotService {

    private readonly logger = new Logger(CoreBotService.name);

    private client: NodeIRC.Client;

    private channelUsersPrivileges = {};

    constructor(private cacheSrv: CacheRedisService, private kvsSrv: KVSService) {
        if(environments.bot.enabled) {
            this.client = new NodeIRC.Client(environments.bot.server, environments.bot.botName, {
                channels: environments.bot.channels
            });
            this.init();
        }
    }

    private init() {
        // attach bot events.
        this.client.on('registered', () => {
            this.client.say('NickServ', 'identify ' + environments.bot.password);
        });
        this.client.on('nick', (oldnick, newnick, channels, message) => {
            if(oldnick == environments.bot.botName) {
                environments.bot.botName = newnick;
            }
        });
        this.client.on('names', (channel, nicks) => {
            this.channelUsersPrivileges[channel] = nicks;
        });        
        this.client.on('pm', (nick, text) => {
            // private message.
            const dataPart = text.trim().split(' ');
            // #channel polsaker r probando #aaa
            if (dataPart[0] == 'ayuda' || dataPart[0] == 'help') {
                this.client.say(nick, '/hc join #canal | para unir el bot al canal');
                this.client.say(nick, '/hc #canal userNick r RangoNombre #aaa | dar rango en un canal a un usuario');
                this.client.say(nick, '/hc #canal userNick -r | eliminar rango en un canal a un usuario');
                this.client.say(nick, '/hc userNick g RangoNombre #aaa | dar rango global a un usuario');
                this.client.say(nick, '/hc userNick -g | eliminar rango global a un usuario');
                this.client.say(nick, '/hc owners')
                this.client.say(nick, '/hc avatar <link.png> | only png accepted')
            } else if (dataPart[2] == 'r') {
                if(this.channelUsersPrivileges[dataPart[0]] &&
                    (this.channelUsersPrivileges[dataPart[0]][nick] === '&' || 
                    this.channelUsersPrivileges[dataPart[0]][nick] === '~')) {
                    let channel = dataPart[0]; 
                    if(dataPart[0][0] == '#') {
                        channel = channel.slice(1);
                    }
                    if(this.kvsSrv.put('customtitle-'+channel+'-'+dataPart[1].toLocaleLowerCase(), {
                        color: dataPart[4] ? dataPart[4] : '#b9b9b9',
                        rango: dataPart[3]
                    })) {
                        this.client.say(nick, 'ok');
                    } else {
                        this.client.say(nick, 'oops, ocurrió un error.');
                    }
                } else {
                    if(!this.channelUsersPrivileges[dataPart[0]]) {
                        this.client.say(nick, 'No estaba en el canal, prueba de nuevo.');
                        this.client.join(dataPart[0]);
                    } else {
                        this.client.say(nick, 'No eres admin o founder del canal.');
                    }
                }
            } else if (dataPart[2] == '-r') {
                if(this.channelUsersPrivileges[dataPart[0]] &&
                    (this.channelUsersPrivileges[dataPart[0]][nick] === '&' || 
                    this.channelUsersPrivileges[dataPart[0]][nick] === '~')) {
                    let channel = dataPart[0]; 
                    if(dataPart[0][0] == '#') {
                        channel = channel.slice(1);
                    }
                    this.kvsSrv.del('customtitle-'+channel+'-'+dataPart[1].toLocaleLowerCase());
                    this.client.say(nick, 'ok');
                } else {
                    if(!this.channelUsersPrivileges[dataPart[0]]) {
                        this.client.say(nick, 'No estaba en el canal, prueba de nuevo.');
                        this.client.join(dataPart[0]);
                    } else {
                        this.client.say(nick, 'No eres admin o founder del canal.');
                    }
                }
            } else if (dataPart[1] == '-g') {
                if(environments.bot.owners.find(boss => boss.toLocaleLowerCase() === nick.toLocaleLowerCase())) {
                    const user = dataPart[0].toLocaleLowerCase();
                    this.kvsSrv.del('globaltitle-'+user);
                    this.client.say(nick, 'ok');
                } else {
                    this.client.say(nick, 'No te encuentras en la lista de nicks habilitados. ');
                }
            } else if (dataPart[1] == 'g') {
                if(environments.bot.owners.find(boss => boss.toLocaleLowerCase() === nick.toLocaleLowerCase())) {
                    const user = dataPart[0].toLocaleLowerCase();
                    if(this.kvsSrv.put('globaltitle-'+user,{
                        color: dataPart[3] ? dataPart[3] : '#b9b9b9',
                        rango: dataPart[2]
                    })) {
                        this.client.say(nick, 'ok');
                    } else {
                        this.client.say(nick, 'oops, ocurrió un error al guardar.')
                    }
                } else {
                    this.client.say(nick, 'No te encuentras en la lista de nicks habilitados. ');
                }
            } else if (dataPart[0] == 'owners') {
                this.client.say(nick, 'Lista de owners: ' + environments.bot.owners);
            } else if (dataPart[0] == 'avatar') {
                const url = dataPart[1];
                const imageLink = /(http(s?):)([\/|.|\w|\s|-])*\.(jpg|gif|png)/.exec(url);
                if(imageLink) {
                    let type = 'image/'+imageLink[4];
                    if(imageLink[4] === 'jpg') {
                        type = 'image/jpeg';
                    }
                    if(this.kvsSrv.put('avatar-'+nick,{
                        url,
                        type 
                    })) {
                        this.cacheSrv.invalidate('cache-avatar-'+nick);
                        this.client.say(nick, 'Avatar updated.');
                    } else {
                        this.client.say(nick, 'Oops hay un error al guardar tu avatar.');
                    }
                } else {
                    this.client.say(nick, 'Invalid link.');
                }
            } else if (dataPart[0] == 'join' && dataPart[1]) {
                this.client.join(dataPart[1]);
            }
        });
    }
}
