import { Injectable } from '@nestjs/common';
import { MetricCollectorService, SchemaDataType } from 'src/utils/metric-collector/metric-collector.service';

@Injectable()
export class CacheService {

    private memoryCache: CacheContainer = {};

    constructor(private metricCollector: MetricCollectorService) {
        this.metricCollector.setMetricSchema('hirana.tools.cache', { // tags:
            result: ['found', 'saved', 'unresolved'],
        },{ // Data of this request:
            cachedElements: SchemaDataType.INTEGER,
            container: SchemaDataType.STRING
        });
    }

    public initMemoryCache(container: string) {
        this.memoryCache[container] = {};
    }

    public getCache(container: string, key: string) {
        const result = this.memoryCache[container] && this.memoryCache[container][key] ? 'found' : 'unresolved';
        this.metricCollector.writeMetric('hirana.tools.cache', {result}, {cachedElements: Object.entries(this.memoryCache[container]).length, container});
        return this.memoryCache[container][key];
    }

    public setCache(container: string, data: DataStore): void {
        this.memoryCache[container][data.key] = data.data;
        this.metricCollector.writeMetric('hirana.tools.cache', {result: 'saved'}, {cachedElements: Object.entries(this.memoryCache[container]).length, container});
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