import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {

    private memoryCache: CacheContainer = {};

    constructor() { }

    public initMemoryCache(container: string) {
        this.memoryCache[container] = {};
    }

    public getCache(container: string, key: string) {
        const result = this.memoryCache[container] && this.memoryCache[container][key] ? 'found' : 'unresolved';
        return this.memoryCache[container][key];
    }

    public setCache(container: string, data: DataStore): void {
        this.memoryCache[container][data.key] = data.data;
    }

}

export class DataStore {
    public key: string;
    public data: any;

    constructor(key: string, data: any) {
        this.key = key;
        this.data = data;
    }
}

export class CachedData {
    [key:string]: any;
}

export class CacheContainer {
    [key: string]: CachedData
}