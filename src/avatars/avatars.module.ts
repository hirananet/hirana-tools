import { MetricCollectorModule } from 'src/utils/metric-collector/metric-collector.module';
import { environments } from './../environment';
import { StorageModule } from './../storage/storage.module';
import { AvatarsController } from './avatars.controller';
import { HttpModule, Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
    imports: [
        CacheModule,
        StorageModule,
        HttpModule.register({
            timeout: environments.avatarHttpTimeout,
            maxRedirects: 5,
        }),
        MetricCollectorModule
    ],
    controllers: [
        AvatarsController
    ],
    providers: [
        AvatarService
    ]
})
export class AvatarsModule {}
