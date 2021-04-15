import { Module } from '@nestjs/common';
import { MetricCollectorModule } from 'src/utils/metric-collector/metric-collector.module';
import { CacheService } from './cache.service';

@Module({
  imports: [
    MetricCollectorModule
  ],
  providers: [
    CacheService
  ],
  exports: [
    CacheService
  ]
})
export class CacheModule {}
