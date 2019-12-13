import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionService } from './prescription.service';
import { Prescription } from '../models/prescription.entity';

describe('PrescriptionService', () => {
  let svc: PrescriptionService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionService,
        { provide: getRepositoryToken(Prescription), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<PrescriptionService>(PrescriptionService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
