import { CoreUtilsModule } from './../utils/core-utils/core-utils.module';
import { Module } from '@nestjs/common';
import { CoreBotService } from './core-bot.service';

@Module({
  providers: [
    CoreBotService
  ],
  imports: [
    CoreUtilsModule
  ]
})
export class HiranaBotModule {}
