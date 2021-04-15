import { ImgurApiModule } from './imgur-api/imgur-api.module';
import { HiranaBotModule } from './hirana-bot/hirana-bot.module';
import { Module } from '@nestjs/common';
import { AvatarsModule } from './avatars/avatars.module';
import { CustomTitlesModule } from './custom-titles/custom-titles.module';
import { UriProcessorModule } from './uri-processor/uri-processor.module';
import { CacheModule } from './cache/cache.module';
import { StorageModule } from './storage/storage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricCollectorInterceptor } from './utils/metric-collector/metric-collector.interceptor';

@Module({
  imports: [
    UriProcessorModule,
    AvatarsModule,
    CustomTitlesModule,
    HiranaBotModule,
    ImgurApiModule,
    CacheModule,
    StorageModule
  ],
  controllers: [
    
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricCollectorInterceptor
    }
  ],
})
export class AppModule {
}
