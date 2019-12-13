import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { LabTestService } from './labtest.service';
import { LabTest } from '../models/labtest.entity';

describe('LabTestService', () => {
  let svc: LabTestService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LabTestService,
        { provide: getRepositoryToken(LabTest), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<LabTestService>(LabTestService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
