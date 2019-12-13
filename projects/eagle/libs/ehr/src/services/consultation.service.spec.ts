import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationService } from './consultation.service';
import { Consultation } from '../models/consultation.entity';

describe('ConsultationService', () => {
  let svc: ConsultationService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationService,
        { provide: getRepositoryToken(Consultation), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<ConsultationService>(ConsultationService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
