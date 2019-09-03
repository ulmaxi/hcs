import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostService } from './posts.service';
import { Post } from '../models/posts.entity';


describe('PostService', () => {
  let postSvc: PostService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useValue: mockRepo },
      ],
    }).compile();

    postSvc = module.get<PostService>(PostService);
  });

  describe('constructor', () => {
    it('should instanciate permission service', () => {
      expect(postSvc.repository).toBeDefined();
    });
  });
});
