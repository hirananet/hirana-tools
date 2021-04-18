import { Injectable, Logger } from '@nestjs/common';
import * as redis from 'redis';
import { Subject } from 'rxjs';

@Injectable()
export class SubscriberService {

    private readonly logger = new Logger(SubscriberService.name);

    private readonly redisClient: redis.RedisClient;
    private onMessage: Subject<{message: string | object, topic: string}> = new Subject<{message: string | object, topic: string}>();
    private onError: Subject<any> = new Subject<any>();
    private handlers: {[key: string]: Subject<string>} = {};

    constructor() {
        this.redisClient = redis.createClient({
            host: process.env.SUBSCRIBER_HOST ? process.env.SUBSCRIBER_HOST : 'srv-captain--redistest',
            auth_pass: process.env.SUBSCRIBER_AUTH ? process.env.SUBSCRIBER_AUTH : '38674516',
            port: process.env.SUBSCRIBER_PORT ? parseInt(process.env.SUBSCRIBER_PORT) :  6379
        });
        this.redisClient.on('error', (err) => {
            this.logger.error('Redis subscriber error ' + err.toString());
            this.onError.next(err);
        });
        this.redisClient.on('message', (topic, message) => {
            this.onMessage.next({
                topic,
                message
            });
            if(this.handlers[topic]) {
                try {
                    const _message = JSON.parse(message);
                    message = _message ? _message : message;
                } catch(e) {}
                this.handlers[topic].next(message);
            }
        });
    }
    
    /**
     * @param topic topic to suscribe
     * @returns Observable to handle messages.
     */
    public attach(topic: string): Subject<string | object> {
        this.redisClient.subscribe(topic);
        this.handlers[topic] = new Subject<string>();
        return this.handlers[topic];
    }

    public getSubscription(topic: string): Subject<string | object> {
        return this.handlers[topic];
    }

    public getOnError() {
        return this.onError;
    }

    public getOnMessage() {
        return this.onMessage;
    }

}
