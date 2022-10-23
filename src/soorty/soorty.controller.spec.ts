import { Test, TestingModule } from '@nestjs/testing';
import { SoortyController } from './soorty.controller';
import { SoortiService } from './soorty.service';

describe('SoortyController', () => {
  let controller: SoortyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoortyController],
      providers: [SoortiService],
    }).compile();

    controller = module.get<SoortyController>(SoortyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
