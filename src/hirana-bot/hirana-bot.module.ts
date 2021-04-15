import { CacheModule } from './../cache/cache.module';
import { Module } from '@nestjs/common';
import { StorageModule } from 'src/storage/storage.module';
import { CoreBotService } from './core-bot.service';

@Module({
  providers: [
    CoreBotService
  ],
  imports: [
    StorageModule,
    CacheModule
  ]
})
export class HiranaBotModule {}
