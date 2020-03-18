import { Test } from '@nestjs/testing';
import { CommentService } from '../services/comment.service';
import { CommentController } from './comment.controller';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: {} }],
    }).compile();

    service = module.get<CommentService>(CommentService);
    controller = module.get<CommentController>(CommentController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
