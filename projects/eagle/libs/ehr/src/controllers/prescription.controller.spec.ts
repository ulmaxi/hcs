import { Test } from '@nestjs/testing';
import { PrescriptionService } from '../services/prescription.service';
import { PrescriptionController } from './prescription.controller';

describe('PrescriptionController', () => {
  let controller: PrescriptionController;
  let service: PrescriptionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PrescriptionController],
      providers: [{ provide: PrescriptionService, useValue: { } }],
    }).compile();

    service = module.get<PrescriptionService>(PrescriptionService);
    controller = module.get<PrescriptionController>(PrescriptionController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
