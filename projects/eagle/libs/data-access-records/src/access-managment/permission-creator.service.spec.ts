import { Test } from '@nestjs/testing';
import { addMonths } from 'date-fns';
import {
  PermissionCreatorService,
  permissionRequestDetailError,
  permissionRequestUserError,
  permissionRequestAuthorizationError,
  OTPAddress,
  AlertOtp,
} from './permission-creator.service';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
import { ClientProxy } from '@nestjs/microservices';
import { DataRetrievalService } from './data-retrieval.service';
import { microServiceToken, MessageEvents, SendSMSEvent } from '@eagle/server-shared';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';
import { PersonalBiodata } from '@eagle/users-admininistration';
import { AccessLevel, Authorization } from '@eagle/authentication';

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
  institutionId: 'instution-id',
};

const institutionBase: { trackId: string; name: string } = {
  trackId: 'institution-trackId',
  name: 'institution',
};

const clientBase: PersonalBiodata & { id: string } = {
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

describe('PermissionCreatorService', () => {
  let svc: PermissionCreatorService;
  let permissionSvc: PermissionRecordService;
  let clientSvc: ClientProxy;
  let transportSvc: DataRetrievalService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [],
      providers: [
        PermissionCreatorService,
        DataRetrievalService,
        { provide: PermissionRecordService, useValue: mockPermSvc },
        { provide: microServiceToken, useValue: clientMock },
      ],
    }).compile();

    transportSvc = app.get<DataRetrievalService>(DataRetrievalService);
    permissionSvc = app.get<PermissionRecordService>(PermissionRecordService);
    svc = app.get<PermissionCreatorService>(PermissionCreatorService);
    clientSvc = app.get<ClientProxy>(microServiceToken);
  });

  describe('request', () => {
    it('should throw permission Request Detail Error for invalid datas', async () => {
      try {
        jest
          .spyOn(transportSvc, 'retrieveInstitution')
          .mockResolvedValue(institutionBase);
        jest.spyOn(transportSvc, 'retrieveAuth').mockResolvedValue(null);
        jest.spyOn(svc, 'retrieveBiodata').mockResolvedValue(null);
        await svc.create(
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
      jest.spyOn(svc, 'retrieveBiodata').mockResolvedValue(clientBase);
      const retrieveSpy = jest.spyOn(
        svc as any,
        'saveAndAlertRequest',
      );
      await svc.create(
        institutionBase.trackId,
        authorBase.identification,
      );
      expect(retrieveSpy).toHaveBeenCalledWith(otpAddr);
    });
  });

  describe('retrieveBiodata', () => {
    it('should throw error for invalid clientAuth', async () => {
      try {
        await svc.retrieveBiodata(null);
      } catch (error) {
        expect(error).toEqual(permissionRequestUserError);
      }
    });
    it('should throw error for non-existent biodata', async () => {
      try {
        jest
          .spyOn(transportSvc, 'retrievePersonalBiodata')
          .mockResolvedValue(null);
        await svc.retrieveBiodata(authorBase);
      } catch (error) {
        expect(error).toEqual(permissionRequestUserError);
      }
    });

    it('should return a valid user biodata', async () => {
      jest
        .spyOn(transportSvc, 'retrievePersonalBiodata')
        .mockResolvedValue(clientBase);
      const biodata = await svc.retrieveBiodata(authorBase);
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
        .spyOn(svc, 'saveNewPermission')
        .mockResolvedValue(validPermssion);
      const alertSpy = jest.spyOn(svc, 'alertOtp');
      const perm = await svc.saveAndAlertRequest(otpAddr);
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
        .spyOn(svc, 'generateNewPermission')
        .mockReturnValue(validPermssion);
      jest
        .spyOn(permissionSvc.repository, 'save')
        .mockImplementation(arg => Promise.resolve(arg as PermissionRecord));
      const perm = await svc.saveNewPermission(
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
      const perm = svc.generateNewPermission(institution, clientId);
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
      svc.alertOtp(otpAlert);
    });
  });

  describe('authorize', () => {
    it(`should throw error if permission doesn't exist`, async () => {
      try {
        jest.spyOn(permissionSvc, 'findOne').mockResolvedValue(null);
        await svc.authorize(validPermssion.id, 23333);
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
      const perm = await svc.authorize(
        invalidPerm.id,
        invalidPerm.code,
      );
      expect(perm).toEqual(validPermssion);
    });
  });

});
