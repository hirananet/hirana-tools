import { Test, TestingModule } from '@nestjs/testing';
import { NickDataController } from './nick-data.controller';

describe('NickDataController', () => {
  let controller: NickDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NickDataController],
    }).compile();

    controller = module.get<NickDataController>(NickDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
