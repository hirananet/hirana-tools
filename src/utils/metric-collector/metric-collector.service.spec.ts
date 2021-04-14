import { Test, TestingModule } from '@nestjs/testing';
import { MetricCollectorService } from './metric-collector.service';

describe('MetricCollectorService', () => {
  let service: MetricCollectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricCollectorService],
    }).compile();

    service = module.get<MetricCollectorService>(MetricCollectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
