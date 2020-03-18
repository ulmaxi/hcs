import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { emergencyFactory, institutionFactory } from '@ulmax/testing';
import { omit } from 'lodash';
import { of } from 'rxjs';
import { Emergency } from '../models/emergency.entity';
import {
  InstitutionClassificationError,
  PublicDataService,
} from './data.service';
import { EmergencyService } from './emergency.service';
import { EmergencyResponse } from './typecast';

describe('PublicDataService', () => {
  let module: TestingModule;
  let svc: PublicDataService;
  let clientSvc: ClientProxy;
  let emergencySvc: EmergencyService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PublicDataService,
        {
          provide: EmergencyService,
          useValue: { repository: { save: jest.fn } },
        },
        {
          provide: microServiceToken,
          useValue: {
            emit: () => ({ toPromise: jest.fn }),
            send: () => ({ toPromise: jest.fn }),
          },
        },
      ],
    }).compile();

    clientSvc = module.get<ClientProxy>(microServiceToken);
    svc = module.get<PublicDataService>(PublicDataService);
    emergencySvc = module.get<EmergencyService>(EmergencyService);
  });

  describe('institutions', () => {
    it('should throw error if classification is missing', async () => {
      try {
        svc.institutions({});
      } catch (error) {
        expect((error as Error).message).toEqual(
          InstitutionClassificationError.message,
        );
      }
    });

    it('should send the request through the client', async () => {
      const classification = 'hospital';
      const hospitals = institutionFactory
        .buildList(10)
        .filter(i => i.classification === classification);
      const proxySpy = jest
        .spyOn(clientSvc, 'send')
        .mockReturnValueOnce(of(hospitals));
      svc.institutions({ classification });
      expect(proxySpy).toHaveBeenCalledWith('', { classification });
    });
  });

  describe('institutionDetailsFromName', () => {
    it('should emit an event to retrieve the isntitution details', () => {
      const institution = institutionFactory.build();
      const sendSpy = spyOn(clientSvc, 'send').and.returnValue(of(institution));
      svc.institutionDetailsFromName(institution.name);
      expect(sendSpy).toHaveBeenLastCalledWith('', { name: institution.name });
    });
  });

  describe('alertEmergency', () => {
    it('should save and alert the institutions', async () => {
      const emergency: Emergency = emergencyFactory.build();
      const institution = institutionFactory.build();
      const emergencyResponse: EmergencyResponse = {
        emergency,
        institution: omit(institution as any, [
          'id',
          'trackId',
          'zipcode',
          'country',
        ]),
      };
      const saveSpy = spyOn(emergencySvc.repository, 'save').and.returnValue(
        emergency,
      );
      const insitutionSpy = spyOn(
        svc,
        'institutionDetailsFromName',
      ).and.returnValue(of(institution));
      const dispatchSpy = spyOn(svc, 'dispatchEmergency').and.callFake(
        jest.fn(),
      );
      const res = await svc.alertEmergency(emergency);
      // expect(svc.alertEmergency(emergency)).toEqual(emergencyResponse);
      expect(insitutionSpy).toHaveBeenCalledWith(emergency.hospital);
      expect(saveSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(institution, emergency);
    });
  });

  describe('dispatchEmergency', () => {
    it('should emit an event to alert all institituions of the emergency', () => {
      const proxySpy = spyOn(clientSvc, 'emit');
      const institution = institutionFactory.build();
      const emergency: Emergency = emergencyFactory.build();
      svc.dispatchEmergency(institution as any, emergency);
      expect(proxySpy).toHaveBeenCalledWith('', emergency);
    });
  });
});
