import { CoinsData } from './coins.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KVSService } from 'src/utils/core-utils/kvs/kvs.service';

@Injectable()
export class CoinsService {

    constructor(private kvs: KVSService) {}

    public async get(nick: string) {
        return await this.kvs.get('banco-'+nick, true);
    }

    public async addCoins(nick: string, data: CoinsData, clientID: string) {
        let savedCoins = await this.kvs.get('banco-'+nick, true);
        if(savedCoins) {
            data.action = 'add';
            savedCoins.history.push({
                action: 'add',
                resaon: data.reason,
                ammount: data.ammount,
                clientID
            });
            savedCoins.coins += data.ammount;
        } else {
            data.action = 'add';
            data.clientID = clientID;
            savedCoins = {
                history: [data],
                coins: data.ammount
            };
        }
        if(this.kvs.put('banco-'+nick, savedCoins)) {
            return savedCoins;
        } else {
            throw new HttpException('Servicio no disponible en este momento, reintentar operación.', HttpStatus.BAD_GATEWAY);
        }
    }

    public async substractCoins(nick: string, data: CoinsData, clientID: string) {
        let savedCoins = await this.kvs.get('banco-'+nick, true);
        if(savedCoins) {
            data.action = 'substract';
            savedCoins.history.push({
                action: 'substract',
                resaon: data.reason,
                ammount: data.ammount,
                clientID
            });
            savedCoins.coins -= data.ammount;
            if(savedCoins.coins < 0) {
                throw new HttpException('Insufficient funds.', HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException('Nick not found.', HttpStatus.NOT_FOUND);
        }
        if(this.kvs.put('banco-'+nick, savedCoins)) {
            return savedCoins;
        } else {
            throw new HttpException('Servicio no disponible en este momento, reintentar operación.', HttpStatus.BAD_GATEWAY);
        }
    }

}
