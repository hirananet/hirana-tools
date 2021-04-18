import { SubscriberService } from './subscriber/subscriber.service';
import { KVSService } from './kvs/kvs.service';
import { Module } from '@nestjs/common';
import { MetricCollectorService } from './metric-collector/metric-collector.service';
import { HealthCheckController } from './health-check/health-check.controller';
import { CacheRedisService } from './cache-redis/cache-redis.service';
import { PublisherService } from './publisher/publisher.service';

@Module({
  providers: [MetricCollectorService, CacheRedisService, KVSService, PublisherService, SubscriberService],
  exports: [MetricCollectorService, CacheRedisService, KVSService, PublisherService, SubscriberService],
  controllers: [HealthCheckController]
})
export class CoreUtilsModule {}
