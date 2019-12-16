import { Test } from '@nestjs/testing';
import {
  InstitutionAccessService,
  permssionVerificationError,
  AlertOtp,
  permissionRequestDetailError,
  OTPAddress,
  permissionRequestUserError,
  permissionRequestAuthorizationError,
} from './institution-access.service';
import { PermissionRecordService } from './permission-records.service';
import { PermissionRecord } from '../models/permission-records.entity';
import { addMonths, subMonths } from 'date-fns';
import {
  microServiceToken,
  SendSMSEvent,
  MessageEvents,
} from '@eagle/server-shared';
import { ClientProxy } from '@nestjs/microservices';
import { DataRetrievalService } from './data-retrieval.service';
import { Authorization, AccessLevel, PersonalBiodata } from '@eagle/generated';

const mockPermSvc = {
  find: jest.fn,
  findOne: jest.fn,
  repository: {
    save: jest.fn,
  },
};

const clientMock = {
  emit: jest.fn,
};

const today = new Date();

const validPermssion: PermissionRecord = {
  authorized: true,
  clientId: 'cl-ent-id',
  code: 122345,
  createdAt: today,
  expires: addMonths(today, 3),
  id: 'random-id',
  institution: 'i-n-s-t-i-t-u-i-o-n',
  updatedAt: today,
};

const authorBase: Authorization = {
  accessLevel: AccessLevel.Institution,
  apiKey: 'random-apikey',
  identification: 'institution@mail.com',
  trackId: 'institution-trackId',
  institutionId: 'instution-id'
};

const institutionBase: { trackId: string; name: string } = {
  trackId: 'institution-trackId',
  name: 'institution',
};

const clientBase: PersonalBiodata & { id: string }= {
  address: 'random_address',
  dob: 1111111111111111,
  firstname: 'first_name',
  lastname: 'last_name',
  trackId: 'track-id',
  email: 'ran@m.c',
  gender: 'female',
  id: 'random_id',
  town: 'town_id',
};

describe('InstitutionAccessService', () => {
  let instutionSvc: InstitutionAccessService;
  let permissionSvc: PermissionRecordService;
  let clientSvc: ClientProxy;
  let transportSvc: DataRetrievalService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [],
      providers: [
        InstitutionAccessService,
        DataRetrievalService,
        { provide: PermissionRecordService, useValue: mockPermSvc },
        { provide: microServiceToken, useValue: clientMock },
      ],
    }).compile();

    transportSvc = app.get<DataRetrievalService>(DataRetrievalService);
    permissionSvc = app.get<PermissionRecordService>(PermissionRecordService);
    instutionSvc = app.get<InstitutionAccessService>(InstitutionAccessService);
    clientSvc = app.get<ClientProxy>(microServiceToken);
  });

  describe('verify', () => {
    it('should throw error if novalid permssion', async () => {
      try {
        jest.spyOn(permissionSvc, 'find').mockResolvedValue([]);
        const { institution, clientId } = validPermssion;
        await instutionSvc.verify(institution, clientId);
      } catch (error) {
        expect(error).toEqual(permssionVerificationError);
      }
    });

    it('should return valid permission if verified', async () => {
      jest.spyOn(permissionSvc, 'find').mockResolvedValue([validPermssion]);
      const { institution, clientId } = validPermssion;
      expect(await instutionSvc.verify(institution, clientId)).toEqual(
        validPermssion,
      );
    });
  });

  describe('filterAuthorizedPermission', () => {
    it('should return a valid permission if among the permissions', () => {
      expect(instutionSvc.filterAuthorizedPermission([validPermssion])).toEqual(
        validPermssion,
      );
    });

    it('should return null if all are invalid permission', () => {
      const invalid1 = validPermssion;
      invalid1.createdAt = subMonths(today, 10);
      invalid1.expires = subMonths(today, 8);
      const invalid2 = validPermssion;
      invalid1.createdAt = subMonths(today, 3);
      invalid1.expires = subMonths(today, 1);
      expect(
        instutionSvc.filterAuthorizedPermission([invalid1, invalid2]),
      ).toBeUndefined();
    });
  });

  describe('request', () => {
    it('should throw permission Request Detail Error for invalid datas', async () => {
      try {
        jest
          .spyOn(transportSvc, 'retrieveInstitution')
          .mockResolvedValue(institutionBase);
        jest.spyOn(transportSvc, 'retrieveAuth').mockResolvedValue(null);
        jest.spyOn(instutionSvc, 'retrieveBiodata').mockResolvedValue(null);
        await instutionSvc.request(
          institutionBase.trackId,
          authorBase.identification,
        );
      } catch (error) {
        expect(error).toEqual(permissionRequestDetailError);
      }
    });

    it('should call saveAndAlertRequest with the argument ', async () => {
      const otpAddr: OTPAddress = {
        clientName: `${clientBase.firstname} ${clientBase.lastname}`,
        clientPhoneNo: authorBase.identification,
        institutionId: institutionBase.trackId,
        institutionName: institutionBase.name,
      };
      jest
        .spyOn(transportSvc, 'retrieveInstitution')
        .mockResolvedValue(institutionBase);
      jest.spyOn(transportSvc, 'retrieveAuth').mockResolvedValue(authorBase);
      jest.spyOn(instutionSvc, 'retrieveBiodata').mockResolvedValue(clientBase);
      const retrieveSpy = jest.spyOn(
        instutionSvc as any,
        'saveAndAlertRequest',
      );
      await instutionSvc.request(
        institutionBase.trackId,
        authorBase.identification,
      );
      expect(retrieveSpy).toHaveBeenCalledWith(otpAddr);
    });
  });

  describe('retrieveBiodata', () => {
    it('should throw error for invalid clientAuth', async () => {
      try {
        await instutionSvc.retrieveBiodata(null);
      } catch (error) {
        expect(error).toEqual(permissionRequestUserError);
      }
    });
    it('should throw error for non-existent biodata', async () => {
      try {
        jest
          .spyOn(transportSvc, 'retrievePersonalBiodata')
          .mockResolvedValue(null);
        await instutionSvc.retrieveBiodata(authorBase);
      } catch (error) {
        expect(error).toEqual(permissionRequestUserError);
      }
    });

    it('should return a valid user biodata', async () => {
      jest
        .spyOn(transportSvc, 'retrievePersonalBiodata')
        .mockResolvedValue(clientBase);
      const biodata = await instutionSvc.retrieveBiodata(authorBase);
      expect(biodata).toEqual(clientBase);
    });
  });

  describe('saveAndAlertRequest', () => {
    it('should alert the client with the otpCode', async () => {
      const otpAddr: OTPAddress = {
        clientName: '_a_clint_name',
        clientPhoneNo: '08149464288',
        institutionId: '_insititution_id',
        institutionName: '__insitution_name',
      };
      jest
        .spyOn(instutionSvc, 'saveNewPermission')
        .mockResolvedValue(validPermssion);
      const alertSpy = jest.spyOn(instutionSvc, 'alertOtp');
      const perm = await instutionSvc.saveAndAlertRequest(otpAddr);
      expect(alertSpy).toHaveBeenCalledWith({
        ...otpAddr,
        code: validPermssion.code,
      });
      expect(perm).toEqual(validPermssion);
    });
  });

  describe('saveNewPermission', () => {
    it('should save and return the new generated permission', async () => {
      jest
        .spyOn(instutionSvc, 'generateNewPermission')
        .mockReturnValue(validPermssion);
      jest
        .spyOn(permissionSvc.repository, 'save')
        .mockImplementation(arg => Promise.resolve(arg as PermissionRecord));
      const perm = await instutionSvc.saveNewPermission(
        validPermssion.institution,
        authorBase.identification,
      );
      expect(perm).toEqual(validPermssion);
    });
  });

  describe('generateNewPermission', () => {
    it('should return a permission with properties assigned', () => {
      const institution = 'my_instution';
      const clientId = 'my_clientId';
      const perm = instutionSvc.generateNewPermission(institution, clientId);
      expect(perm).toBeInstanceOf(PermissionRecord);
      expect(perm.institution).toEqual(institution);
      expect(perm.clientId).toEqual(clientId);
    });
  });

  describe('alertOtp', () => {
    it('should send a message event with the clientNetwork', () => {
      const otpAlert: AlertOtp = {
        clientName: '_a_clint_name',
        clientPhoneNo: '08149464288',
        code: 123456,
        institutionId: '_insititution_id',
        institutionName: '__insitution_name',
      };
      jest
        .spyOn(clientSvc as any, 'emit')
        .mockImplementation(
          (event: MessageEvents, { contact, message }: SendSMSEvent) => {
            expect(event).toEqual(MessageEvents.SMS);
            expect(contact).toEqual(otpAlert.clientPhoneNo);
            expect(message).toContain(otpAlert.code);
          },
        );
      instutionSvc.alertOtp(otpAlert);
    });
  });

  describe('authorize', () => {
    it(`should throw error if permission doesn't exist`, async () => {
      try {
        jest.spyOn(permissionSvc, 'findOne').mockResolvedValue(null);
        await instutionSvc.authorize(validPermssion.id, 23333);
      } catch (error) {
        expect(error).toEqual(permissionRequestAuthorizationError);
      }
    });
    
    it('should return authorized permission', async () => {
      const invalidPerm = validPermssion;
      invalidPerm.authorized = false;
      jest.spyOn(permissionSvc, 'findOne').mockResolvedValue(invalidPerm);
      jest
        .spyOn(permissionSvc.repository, 'save')
        .mockImplementation(arg => Promise.resolve(arg as PermissionRecord));
      const perm = await instutionSvc.authorize(
        invalidPerm.id,
        invalidPerm.code,
      );
      expect(perm).toEqual(validPermssion);
    });
  });
});
