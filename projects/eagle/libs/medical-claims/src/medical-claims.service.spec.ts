import { Test, TestingModule } from '@nestjs/testing';
import { MedicalClaimsService } from './medical-claims.service';

describe('MedicalClaimsService', () => {
  let service: MedicalClaimsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalClaimsService],
    }).compile();

    service = module.get<MedicalClaimsService>(MedicalClaimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
