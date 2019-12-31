import { Test } from '@nestjs/testing';
import { LoginService } from '../services/login.service';
import { LoginController } from './login.controller';

describe('LoginController', () => {
  let controller: LoginController;
  let service: LoginService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [{ provide: LoginService, useValue: { } }],
    }).compile();

    service = module.get<LoginService>(LoginService);
    controller = module.get<LoginController>(LoginController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
