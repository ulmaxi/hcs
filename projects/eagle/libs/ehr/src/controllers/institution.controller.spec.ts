import { Test } from '@nestjs/testing';
import { InstitutionService } from '../services/institution.service';
import { InstitutionController } from './institution.controller';


describe('InstitutionController', () => {
  let controller: InstitutionController;
  let service: InstitutionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [InstitutionController],
      providers: [{ provide: InstitutionService, useValue: { } }],
    }).compile();

    service = module.get<InstitutionService>(InstitutionService);
    controller = module.get<InstitutionController>(InstitutionController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
