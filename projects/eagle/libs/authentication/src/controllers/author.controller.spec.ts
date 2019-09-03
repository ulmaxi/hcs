import { Test } from '@nestjs/testing';
import { AuthorService } from '../services/author.service';
import { AuthorController } from './author.controller';



describe('AuthorController', () => {
  let controller: AuthorController;
  let service: AuthorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [{ provide: AuthorService, useValue: { } }],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    controller = module.get<AuthorController>(AuthorController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
