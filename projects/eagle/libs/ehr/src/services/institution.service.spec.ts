import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionService } from './institution.service';
import { Institution } from '../models/institution.entity';

describe('InstitutionService', () => {
  let svc: InstitutionService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionService,
        { provide: getRepositoryToken(Institution), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<InstitutionService>(InstitutionService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
