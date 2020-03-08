import { Test, TestingModule } from '@nestjs/testing';
import { LotaService } from './lota.service';

describe('LotaService', () => {
  let service: LotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotaService],
    }).compile();

    service = module.get<LotaService>(LotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
