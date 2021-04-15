import { CacheModule } from './../cache/cache.module';
import { HttpModule, Module } from '@nestjs/common';
import { UriProcessorController } from './uri-processor.controller';
import { UriProcService } from './uri-proc.service';
import { environments } from 'src/environment';
import { MetricCollectorModule } from 'src/utils/metric-collector/metric-collector.module';

@Module({
  imports: [
    HttpModule.register({
        timeout: environments.urlHttpTimeout,
        maxRedirects: 5,
        maxBodyLength: environments.urlMaxBodyLength
    }),
    CacheModule,
    MetricCollectorModule
  ],
  controllers: [UriProcessorController],
  providers: [UriProcService]
})
export class UriProcessorModule {}
