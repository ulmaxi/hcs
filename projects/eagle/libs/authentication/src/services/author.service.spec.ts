import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthorService } from './author.service';
import { Authorization } from '../models/author.entity';

describe('AuthorService', () => {
  let authorSvc: AuthorService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        { provide: getRepositoryToken(Authorization), useValue: mockRepo },
      ],
    }).compile();
    authorSvc = app.get<AuthorService>(AuthorService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(authorSvc.repository).toBe(mockRepo);
    });
  });
});
