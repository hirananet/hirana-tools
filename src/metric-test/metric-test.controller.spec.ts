import { Test, TestingModule } from '@nestjs/testing';
import { MetricTestController } from './metric-test.controller';

describe('MetricTestController', () => {
  let controller: MetricTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricTestController],
    }).compile();

    controller = module.get<MetricTestController>(MetricTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
