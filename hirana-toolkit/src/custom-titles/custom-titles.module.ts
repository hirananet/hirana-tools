import { CustomTitlesController } from './custom-titles.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [
        CustomTitlesController
    ]
})
export class CustomTitlesModule {}
