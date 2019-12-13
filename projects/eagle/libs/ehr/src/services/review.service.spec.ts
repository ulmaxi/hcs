import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { Review } from '../models/review.entity';

describe('ReviewService', () => {
  let svc: ReviewService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: getRepositoryToken(Review), useValue: mockRepo },
      ],
    }).compile();
    svc = app.get<ReviewService>(ReviewService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(svc.repository).toBe(mockRepo);
    });
  });
});
