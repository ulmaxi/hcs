import { Test } from '@nestjs/testing';
import { AdmissionService } from '../services/admission.service';
import { AdmissionController } from './admission.controller';


describe('AdmissionController', () => {
  let controller: AdmissionController;
  let service: AdmissionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AdmissionController],
      providers: [{ provide: AdmissionService, useValue: { } }],
    }).compile();

    service = module.get<AdmissionService>(AdmissionService);
    controller = module.get<AdmissionController>(AdmissionController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
