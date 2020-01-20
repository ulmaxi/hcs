import { Test } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { ehr_data_preload } from '@ulmax/testing';
import { of } from 'rxjs';
import { StaffService } from '../../data-layer/staff/staff.service';
import { MiniConsultantDetails } from '../util';
import { PersonalDataSnaphotService } from './personal-data.service';

describe('PersonalDataSnaphotService', () => {
  let svc: PersonalDataSnaphotService;
  const { consultants, staffs, authorization } = ehr_data_preload(2);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PersonalDataSnaphotService,
        {
          provide: microServiceToken,
          useValue: {
            send: jest.fn((
              event) => of(
                (event === 'authorization')
                  ? authorization
                  : consultants,
              )),
          },
        },
        {
          provide: StaffService, useValue: {
            repository: {
              findByIds: () => Promise.resolve(staffs),
            },
          },
        },
      ],
    }).compile();

    svc = module.get<PersonalDataSnaphotService>(PersonalDataSnaphotService);
  });

  it('should return a map of consultantIds and their mini details', async () => {
    const trackIds = staffs.map(s => s.id);
    const result: Map<string, MiniConsultantDetails> = await svc.consultants(trackIds);
    const staff = staffs[0];
    const consultantBiodata = consultants.find((b) => b.trackId === staff.trackID);
    const consultantAuthorization = authorization.find((a) => a.trackId === staff.id);
    expect(result.get(staff.id))
      .toStrictEqual({
        department: staff.department,
        field: staff.field,
        id: staff.id,
        name: `${consultantBiodata.firstname} ${consultantBiodata.lastname}`,
        phoneNo: consultantAuthorization.identification,
      } as MiniConsultantDetails);
  });

});
