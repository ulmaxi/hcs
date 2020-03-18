import { Test } from '@nestjs/testing';
import { ehr_data_preload } from '@ulmax/testing';
import { ConsultationService } from '../data-layer/consultation/consultation.service';
import { ConsultationShapshotService } from './consultation-snapshot.service';
import { FieldSnaphotService } from './subfields/fields-snapshot.service';
import { PersonalDataSnaphotService } from './subfields/personal-data.service';

function field2Map<T>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set((item as any).id, item);
  }
  return map;
}

describe('ConsultationShapshotService', () => {
  const db = ehr_data_preload(5);
  let svc: ConsultationShapshotService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConsultationShapshotService,
        {
          provide: ConsultationService,
          useValue: {
            find: jest.fn().mockResolvedValue(db.consultantions),
          },
        },
        {
          provide: PersonalDataSnaphotService,
          useValue: {
            consultants: jest.fn().mockResolvedValue(field2Map(db.consultants)),
          },
        },
        {
          provide: FieldSnaphotService,
          useValue: {
            institutions: jest
              .fn()
              .mockResolvedValue(field2Map(db.institutions)),
            prescriptions: jest
              .fn()
              .mockResolvedValue(field2Map(db.prescriptions)),
            labtests: jest.fn().mockResolvedValue(field2Map(db.labtests)),
            admissions: jest.fn().mockResolvedValue(field2Map(db.admissions)),
          },
        },
      ],
    }).compile();

    svc = module.get<ConsultationShapshotService>(ConsultationShapshotService);
  });

  it('should return an array of history snapshot', async () => {
    const res = await svc.retrieve({}, { skip: 0, depth: 10 });
    expect(res).toBeInstanceOf(Array);
  });
});
