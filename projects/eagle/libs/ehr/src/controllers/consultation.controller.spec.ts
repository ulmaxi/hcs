import { Test } from '@nestjs/testing';
import { ConsultationService } from '../services/consultation.service';
import { ConsultationController } from './consultation.controller';


describe('ConsultationController', () => {
  let controller: ConsultationController;
  let service: ConsultationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ConsultationController],
      providers: [{ provide: ConsultationService, useValue: { } }],
    }).compile();

    service = module.get<ConsultationService>(ConsultationService);
    controller = module.get<ConsultationController>(ConsultationController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
