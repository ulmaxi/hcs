import { Test } from '@nestjs/testing';
import { ConsultationShapshotService } from './consultation-snapshot.service';
import { HistorySnapshotController } from './history-snapshot.controller';
import { FilterOptions } from './util';

describe('HistorySnapshotController', () => {
  let ctrl: HistorySnapshotController;
  let svc: ConsultationShapshotService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HistorySnapshotController],
      providers: [
        {
          provide: ConsultationShapshotService,
          useValue: {
            retrieve: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    svc = module.get<ConsultationShapshotService>(ConsultationShapshotService);
    ctrl = module.get<HistorySnapshotController>(HistorySnapshotController);
  });

  describe('query', () => {
    it('should call the retreive', async () => {
      const patientId = 'patientId';
      const options: Partial<FilterOptions> = { depth: 2 };
      await ctrl.query({ patientId }, options);
      expect(svc.retrieve).toHaveBeenLastCalledWith(
        { patientId },
        { depth: options.depth, skip: 0 },
      );
    });
  });

  describe('microQuery', () => {
    it('should call the retreive', async () => {
      const consultantId = 'consultantId';
      const options: Partial<FilterOptions> = { depth: 2, skip: 4 };
      await ctrl.microQuery({ query: { consultantId }, config: options });
      expect(svc.retrieve).toHaveBeenLastCalledWith({ consultantId }, options);
    });
  });
});
