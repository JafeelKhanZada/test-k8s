import { Test, TestingModule } from '@nestjs/testing';
import { AlkaramService } from './alkaram.service';

describe('AlkaramService', () => {
  let service: AlkaramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlkaramService],
    }).compile();

    service = module.get<AlkaramService>(AlkaramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
