import { ImgurApiModule } from './imgur-api/imgur-api.module';
import { HiranaBotModule } from './hirana-bot/hirana-bot.module';
import { Module } from '@nestjs/common';
import { AvatarsModule } from './avatars/avatars.module';
import { CustomTitlesModule } from './custom-titles/custom-titles.module';
import { UriProcessorModule } from './uri-processor/uri-processor.module';
import { ApmModule } from 'elastic-apm-nest';
import { CoinsModule } from './coins/coins.module';
import { NickDataModule } from './nick-data/nick-data.module';

@Module({
  imports: [
    UriProcessorModule,
    AvatarsModule,
    CustomTitlesModule,
    HiranaBotModule,
    ImgurApiModule,
    ApmModule.forRootAsync(),
    CoinsModule,
    NickDataModule,
  ],
  controllers: [],
})
export class AppModule {
}
