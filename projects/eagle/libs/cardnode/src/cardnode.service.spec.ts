import { Test, TestingModule } from '@nestjs/testing';
import { CardnodeService } from './cardnode.service';

describe('CardnodeService', () => {
  let service: CardnodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardnodeService],
    }).compile();

    service = module.get<CardnodeService>(CardnodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
