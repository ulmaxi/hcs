import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionService } from './admission.service';
import { Admission } from '../models/admission.entity';

describe('AdmissionService', () => {
  let svc: AdmissionService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AdmissionService,
        { provide: getRepositoryToken(Admission), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<AdmissionService>(AdmissionService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
