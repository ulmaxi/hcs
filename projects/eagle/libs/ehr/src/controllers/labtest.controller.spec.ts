import { Test } from '@nestjs/testing';
import { LabTestService } from '../services/LabTest.service';
import { LabTestController } from './LabTest.controller';


describe('LabTestController', () => {
  let controller: LabTestController;
  let service: LabTestService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [LabTestController],
      providers: [{ provide: LabTestService, useValue: { } }],
    }).compile();

    service = module.get<LabTestService>(LabTestService);
    controller = module.get<LabTestController>(LabTestController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
