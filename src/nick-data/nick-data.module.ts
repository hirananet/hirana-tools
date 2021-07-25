import { CoreUtilsModule } from './../utils/core-utils/core-utils.module';
import { Module } from '@nestjs/common';
import { NickDataService } from './nick-data.service';
import { NickDataController } from './nick-data.controller';

@Module({
  imports: [CoreUtilsModule],
  providers: [NickDataService],
  controllers: [NickDataController]
})
export class NickDataModule {}
