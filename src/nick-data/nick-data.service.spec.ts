import { Test, TestingModule } from '@nestjs/testing';
import { NickDataService } from './nick-data.service';

describe('NickDataService', () => {
  let service: NickDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NickDataService],
    }).compile();

    service = module.get<NickDataService>(NickDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
