import { Module } from '@nestjs/common';
import { CoreBotService } from './core-bot.service';

@Module({
  providers: [
    CoreBotService
  ]
})
export class HiranaBotModule {}
