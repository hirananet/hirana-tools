import { Module } from '@nestjs/common';
import { MetricCollectorModule } from 'src/utils/metric-collector/metric-collector.module';
import { MetricTestController } from './metric-test.controller';

@Module({
  controllers: [MetricTestController],
  imports: [
    MetricCollectorModule
  ]
})
export class MetricTestModule {}
