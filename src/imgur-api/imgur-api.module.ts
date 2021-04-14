import { Module } from '@nestjs/common';
import { ImgurApiController } from './imgur-api.controller';

@Module({
  controllers: [ImgurApiController]
})
export class ImgurApiModule {}
