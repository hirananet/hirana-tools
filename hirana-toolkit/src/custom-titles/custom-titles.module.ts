import { CustomTitlesController } from './custom-titles.controller';
import { Module } from '@nestjs/common';
import { CustomTitlesService } from './custom-titles.service';

@Module({
    controllers: [
        CustomTitlesController
    ],
    providers: [CustomTitlesService]
})
export class CustomTitlesModule {}
