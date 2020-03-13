import { Test } from '@nestjs/testing';
import { PostService } from '../services/posts.service';
import { PostContoller } from './post.controller';

describe('PostContoller', () => {
  let controller: PostContoller;
  let service: PostService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostContoller],
      providers: [{ provide: PostService, useValue: { } }],
    }).compile();

    service = module.get<PostService>(PostService);
    controller = module.get<PostContoller>(PostContoller);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
