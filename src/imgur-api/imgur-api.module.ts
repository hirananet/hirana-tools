import { Module } from '@nestjs/common';
import { ImgurApiController } from './imgur-api.controller';
import { ImgurService } from './imgur.service';

@Module({
  controllers: [ImgurApiController],
  providers: [ImgurService]
})
export class ImgurApiModule {}
