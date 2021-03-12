import { Module } from '@nestjs/common';
import { UriProcessorController } from './uri-processor.controller';

@Module({
  controllers: [UriProcessorController]
})
export class UriProcessorModule {}
