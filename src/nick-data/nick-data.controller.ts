import { CacheRedisService } from './../utils/core-utils/cache-redis/cache-redis.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('nick-data')
export class NickDataController {

    constructor(private readonly cache: CacheRedisService) { }

    @Get('/velocity')
    async getRandomVelocity(@Query('nick') nick: string) {
        const key = `vel-${nick}`;
        let vel = await this.cache.getFromCache(key, false);
        if(vel) {
            return vel;
        }
        const min = 3;
        const max = 5;
        vel = (Math.random() * (max - min + 1) + min).toString();
        this.cache.saveInCache(key, 5, vel);
        return vel;
    }

}
