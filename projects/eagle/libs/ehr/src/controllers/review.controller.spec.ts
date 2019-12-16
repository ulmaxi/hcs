import { Test } from '@nestjs/testing';
import { ReviewService } from '../services/review.service';
import { ReviewController } from './review.controller';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [{ provide: ReviewService, useValue: { } }],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    controller = module.get<ReviewController>(ReviewController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
