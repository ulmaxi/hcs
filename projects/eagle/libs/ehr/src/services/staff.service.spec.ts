import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { Staff } from '../models/staff.entity';

describe('StaffService', () => {
  let svc: StaffService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        { provide: getRepositoryToken(Staff), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<StaffService>(StaffService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
