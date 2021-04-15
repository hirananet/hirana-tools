import { ImgurApiModule } from './imgur-api/imgur-api.module';
import { HiranaBotModule } from './hirana-bot/hirana-bot.module';
import { Module } from '@nestjs/common';
import { AvatarsModule } from './avatars/avatars.module';
import { CustomTitlesModule } from './custom-titles/custom-titles.module';
import { UriProcessorModule } from './uri-processor/uri-processor.module';
import { CacheModule } from './cache/cache.module';
import { StorageModule } from './storage/storage.module';
import { MetricCollectorService } from './utils/metric-collector/metric-collector.service';

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
  ],
})
export class AppModule {}
