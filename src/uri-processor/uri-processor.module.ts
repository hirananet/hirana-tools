import { HttpModule, Module } from '@nestjs/common';
import { UriProcessorController } from './uri-processor.controller';
import { UriProcService } from './uri-proc.service';
import { environments } from 'src/environment';
import { CoreUtilsModule } from 'src/utils/core-utils/core-utils.module';

@Module({
  imports: [
    HttpModule.register({
        timeout: environments.urlHttpTimeout,
        maxRedirects: 5,
        maxBodyLength: environments.urlMaxBodyLength
    }),
    CoreUtilsModule
  ],
  controllers: [UriProcessorController],
  providers: [UriProcService]
})
export class UriProcessorModule {}
