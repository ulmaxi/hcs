import { Test, TestingModule } from '@nestjs/testing';
import { EhrIntercomService } from './ehr-intercom.service';

describe('EhrIntercomService', () => {
  let service: EhrIntercomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EhrIntercomService],
    }).compile();

    service = module.get<EhrIntercomService>(EhrIntercomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
