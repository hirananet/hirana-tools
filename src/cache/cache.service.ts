import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {

    private memoryCache: CacheContainer = {};

    constructor() { }

    public initMemoryCache(container: string) {
        this.memoryCache[container] = {};
    }

    public getCache(container: string, key: string) {
        return this.memoryCache[container][key];
    }

    public setCache(container: string, data: DataStore) {
        return this.memoryCache[container][data.key] = data.data;
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