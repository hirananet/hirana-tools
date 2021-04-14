import { CacheService } from './../cache/cache.service';
import { environments } from 'src/environment';
import { Injectable } from '@nestjs/common';
import * as NodeIRC from 'irc';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class CoreBotService {

    private client: NodeIRC.Client;

    private channelUsersPrivileges = { };

    constructor(private storageSrv: StorageService, private cacheSrv: CacheService) {
        if(environments.bot.enabled) {
            this.client = new NodeIRC.Client(environments.bot.server, environments.bot.botName, {
                channels: environments.bot.channels
            });
            this.init();
        }
    }

    private getCustomRange() {
        return this.storageSrv.get(environments.rcStorageKey);
    }

    private getGlobalRange() {
        return this.storageSrv.get(environments.gcStorageKey);
    }

    private getAvatars() {
        return this.storageSrv.get(environments.avatarStorageKey);
    }

    private init() {
        // attach bot events.
        this.client.on('registered', () => {
            this.client.say('NickServ', 'identify ' + environments.bot.password);
        });
        this.client.on('message', (nick, to, text, message) => {
            if (to === environments.bot.botName) {
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
                    this.client.say(nick, '/hc avatar http:/imgur.com/a15q3.png | only png accepted')
                } else if (dataPart[2] == 'r') {
                    if(this.channelUsersPrivileges[dataPart[0]] &&
                       (this.channelUsersPrivileges[dataPart[0]][nick] === '&' || 
                       this.channelUsersPrivileges[dataPart[0]][nick] === '~')) {
                        let channel = dataPart[0]; 
                        if(dataPart[0][0] == '#') {
                            channel = channel.slice(1);
                        }
                        if(!this.getCustomRange().values[channel]) {
                            this.getCustomRange().values[channel] = {};
                        }
                        this.getCustomRange().values[channel][dataPart[1]] = {
                            exists: true,
                            color: dataPart[4] ? dataPart[4] : '#b9b9b9',
                            rango: dataPart[3]
                        };
                        this.getCustomRange().save();
                        this.client.say(nick, 'ok');
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
                        delete this.getCustomRange().values[channel][dataPart[1]];
                        this.getCustomRange().save();
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
                    if(environments.bot.owners.find(boss => boss === nick)) {
                        const user = dataPart[0];
                        delete this.getGlobalRange().values[user];
                        this.getGlobalRange().save();
                        this.client.say(nick, 'ok');
                    } else {
                        this.client.say(nick, 'No te encuentras en la lista de nicks habilitados. ');
                    }
                } else if (dataPart[1] == 'g') {
                    if(environments.bot.owners.find(boss => boss === nick)) {
                        const user = dataPart[0];
                        this.getGlobalRange().values[user] = {
                            exists: true,
                            color: dataPart[3] ? dataPart[3] : '#b9b9b9',
                            rango: dataPart[2]
                        };
                        this.getGlobalRange().save();
                        this.client.say(nick, 'ok');
                    } else {
                        this.client.say(nick, 'No te encuentras en la lista de nicks habilitados. ');
                    }
                } else if (dataPart[0] == 'owners') {
                    this.client.say(nick, 'Lista de owners: ' + environments.bot.owners)
                } else if (dataPart[0] == 'avatar') {
                    const url = dataPart[1];
                    const imageLink = /(http(s?):)([\/|.|\w|\s|-])*\.(jpg|gif|png)/.exec(url);
                    if(imageLink) {
                        let type = 'image/'+imageLink[4];
                        if(imageLink[4] === 'jpg') {
                            type = 'image/jpeg';
                        }
                        this.getAvatars().values[nick] = {
                            url,
                            type
                        };
                        this.getAvatars().save();
                        this.clearCacheAvatar(nick);
                        this.client.say(nick, 'Avatar updated.');
                    } else {
                        this.client.say(nick, 'Invalid link.');
                    }
                } else if (dataPart[0] == 'join' && dataPart[1]) {
                    this.client.join(dataPart[1]);
                }
            }
        });
    }

    private clearCacheAvatar(nick: string) {
        this.cacheSrv.setCache(environments.avatarStorageKey, {
            key: nick,
            data: undefined
        });
    }
}
