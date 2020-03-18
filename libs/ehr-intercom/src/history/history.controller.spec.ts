import { Test } from '@nestjs/testing';
import { FilterOptions } from '@ulmax/ehr';
import { HistoryController } from './history.controller';
import { HistorySnaphotService } from './snapshot.service';

describe('HistoryController', () => {
  let ctrl: HistoryController;
  let svc: HistorySnaphotService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        {
          provide: HistorySnaphotService,
          useValue: {
            graph: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    svc = module.get<HistorySnaphotService>(HistorySnaphotService);
    ctrl = module.get<HistoryController>(HistoryController);
  });

  describe('client', () => {
    it('should call the retreive', async () => {
      const patientId = 'patientId';
      const query: Partial<FilterOptions> = { depth: 2 };
      await ctrl.client(patientId, query);
      expect(svc.graph).toHaveBeenLastCalledWith(
        { patientId },
        { depth: query.depth, skip: 0 },
      );
    });
  });

  describe('consultant', () => {
    it('should call the retreive', async () => {
      const consultantId = 'consultantId';
      const query: Partial<FilterOptions> = { depth: 2, skip: 4 };
      await ctrl.consultant(consultantId, query);
      expect(svc.graph).toHaveBeenLastCalledWith({ consultantId }, query);
    });
  });
});
