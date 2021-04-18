import { environments } from './../environment';
import { AvatarsController } from './avatars.controller';
import { HttpModule, Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: environments.avatarHttpTimeout,
            maxRedirects: 5,
        })
    ],
    controllers: [
        AvatarsController
    ],
    providers: [
        AvatarService
    ]
})
export class AvatarsModule {}
