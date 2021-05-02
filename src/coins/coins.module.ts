import { CoinsController } from './coins.controller';
import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoreUtilsModule } from 'src/utils/core-utils/core-utils.module';

@Module({
    controllers: [
        CoinsController
    ],
    providers: [CoinsService],
    imports: [
        CoreUtilsModule
    ]
})
export class CoinsModule {}
