import { CustomTitlesController } from './custom-titles.controller';
import { Module } from '@nestjs/common';
import { CustomTitlesService } from './custom-titles.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
    imports: [
        StorageModule
    ],
    controllers: [
        CustomTitlesController
    ],
    providers: [CustomTitlesService]
})
export class CustomTitlesModule {}
