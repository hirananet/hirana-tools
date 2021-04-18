import { CoreUtilsModule } from './../utils/core-utils/core-utils.module';
import { environments } from './../environment';
import { AvatarsController } from './avatars.controller';
import { HttpModule, Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: environments.avatarHttpTimeout,
            maxRedirects: 5,
        }),
        CoreUtilsModule
    ],
    controllers: [
        AvatarsController
    ],
    providers: [
        AvatarService
    ]
})
export class AvatarsModule {}
