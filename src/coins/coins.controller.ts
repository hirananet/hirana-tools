import { SecurityGuard } from './security.guard';
import { Body, Controller, Delete, Get, Headers, HttpException, Param, Put, HttpStatus, UseGuards } from '@nestjs/common';
import { CoinsData } from './coins.dto';
import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {

    constructor(private coinsSrv: CoinsService) { }

    @Get(':nick')
    public async getCoinsOfNick(@Param('nick') nick: string) {
        let data = await this.coinsSrv.get(nick);
        return data ? data : {
            coins: 0,
            history: []
        };
    }

    @Put(':nick')
    @UseGuards(SecurityGuard)
    public async addCoins(@Body() newCoins: CoinsData, @Param('nick') nick: string, @Headers('client-id') clientID) {
        if(isNaN(newCoins.ammount) || newCoins.ammount <= 0) {
            throw new HttpException('invalid ammount', HttpStatus.BAD_REQUEST);
        }
        if(!newCoins.reason || newCoins.reason.length <= 2) {
            throw new HttpException('invalid reason', HttpStatus.BAD_REQUEST);
        }
        return await this.coinsSrv.addCoins(nick, newCoins, clientID);
    }

    @Delete(':nick')
    @UseGuards(SecurityGuard)
    public async substractCoins(@Body() newCoins: CoinsData, @Param('nick') nick: string, @Headers('client-id') clientID) {
        if(isNaN(newCoins.ammount) || newCoins.ammount <= 0) {
            throw new HttpException('invalid ammount', HttpStatus.BAD_REQUEST);
        }
        if(!newCoins.reason || newCoins.reason.length <= 2) {
            throw new HttpException('invalid reason', HttpStatus.BAD_REQUEST);
        }
        return await this.coinsSrv.substractCoins(nick, newCoins, clientID);
    }

}
