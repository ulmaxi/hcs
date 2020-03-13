import { Test, TestingModule } from '@nestjs/testing';
import { GeneralPublicService } from './general-public.service';

describe('GeneralPublicService', () => {
  let service: GeneralPublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralPublicService],
    }).compile();

    service = module.get<GeneralPublicService>(GeneralPublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
