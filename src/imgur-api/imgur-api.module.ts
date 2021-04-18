import { CoreUtilsModule } from './../utils/core-utils/core-utils.module';
import { HttpModule, Module } from '@nestjs/common';
import { environments } from 'src/environment';
import { ImgurApiController } from './imgur-api.controller';
import { ImgurService } from './imgur.service';

@Module({
  imports: [
    HttpModule.register({
        timeout: environments.imgurHttpTimeout,
        maxRedirects: 5,
    }),
    CoreUtilsModule
  ],
  controllers: [ImgurApiController],
  providers: [ImgurService]
})
export class ImgurApiModule {}
