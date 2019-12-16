import { Test } from '@nestjs/testing';
import { StaffService } from '../services/staff.service';
import { StaffController } from './staff.controller';

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [{ provide: StaffService, useValue: { } }],
    }).compile();

    service = module.get<StaffService>(StaffService);
    controller = module.get<StaffController>(StaffController);
  });

  describe('service', () => {
    it('should be defined', async () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });
  });
});
