import { Test, TestingModule } from '@nestjs/testing';
import { SoortyService } from './soorty.service';

describe('ProfilesService', () => {
  let service: SoortyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoortyService],
    }).compile();

    service = module.get<SoortyService>(SoortyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
