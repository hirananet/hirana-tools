import { MetricCollectorService } from './metric-collector.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [
        MetricCollectorService
    ],
    exports: [
        MetricCollectorService
    ]
})
export class MetricCollectorModule {}
