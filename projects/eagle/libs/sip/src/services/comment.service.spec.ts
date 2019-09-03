import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { Comment } from '../models/comment.entity';

describe('CommentService', () => {
  let commentSvc: CommentService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(Comment), useValue: mockRepo },
      ],
    }).compile();

    commentSvc = module.get<CommentService>(CommentService);
  });

  describe('constructor', () => {
    it('should instanciate permission service', () => {
      expect(commentSvc.repository).toBeDefined();
    });
  });
});
