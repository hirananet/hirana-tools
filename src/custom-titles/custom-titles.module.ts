import { CoreUtilsModule } from './../utils/core-utils/core-utils.module';
import { CustomTitlesController } from './custom-titles.controller';
import { Module } from '@nestjs/common';
import { CustomTitlesService } from './custom-titles.service';

@Module({
    imports: [
        CoreUtilsModule
    ],
    controllers: [
        CustomTitlesController
    ],
    providers: [CustomTitlesService]
})
export class CustomTitlesModule {}
