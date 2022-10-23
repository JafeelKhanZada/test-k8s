import { Test, TestingModule } from '@nestjs/testing';
import { AlkaramController } from './alkaram.controller';

describe('AlkaramController', () => {
  let controller: AlkaramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlkaramController],
    }).compile();

    controller = module.get<AlkaramController>(AlkaramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
