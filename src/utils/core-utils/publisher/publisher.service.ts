import { Injectable, Logger } from '@nestjs/common';
import * as redis from 'redis';
import { Subject } from 'rxjs';

@Injectable()
export class PublisherService {

    private readonly logger = new Logger(PublisherService.name);

    private readonly redisClient: redis.RedisClient;
    private onError: Subject<any> = new Subject<any>();

    constructor() {
        this.redisClient = redis.createClient({
            host: process.env.PUBLISHER_HOST ? process.env.PUBLISHER_HOST : 'srv-captain--redistest',
            auth_pass: process.env.PUBLISHER_AUTH ? process.env.PUBLISHER_AUTH : '38674516',
            port: process.env.PUBLISHER_PORT ? parseInt(process.env.PUBLISHER_PORT) :  6379
        });
        this.redisClient.on('error', (err) => {
            this.logger.error('Redis publisher error ' + err.toString());
            this.onError.next(err);
        });
    }

    /**
     * 
     * @param topic topic to send data
     * @param message data to send in string or object (json converted)
     * @returns boolean if can send data.
     */
    public publish(topic: string, message: string | object): boolean {
        if(typeof message == 'object') {
            message = JSON.stringify(message);
        }
        return this.redisClient.publish(topic, message);
    }

    public getOnError() {
        return this.onError;
    }
}
