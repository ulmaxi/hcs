import { Test, TestingModule } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { addMonths } from 'date-fns';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
import { PermissionCreatorService } from './permission-creator.service';
import {
  PermissionManagmentService,
  permissionRequestAuthorizationError,
  permssionVerificationError,
} from './permission-managment.service';

const mockPermSvc = {
  find: jest.fn,
  findOne: jest.fn,
  repository: {
    save: jest.fn,
  },
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

describe('PermissionManagmentService', () => {
  let app: TestingModule;
  let svc: PermissionManagmentService;
  let permissionSvc: PermissionRecordService;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [
        PermissionManagmentService,
        { provide: PermissionRecordService, useValue: mockPermSvc },
        { provide: PermissionCreatorService, useValue: { create: () => null } },
        { provide: microServiceToken, useValue: { emit: () => null } },
      ],
    }).compile();
    svc = app.get<PermissionManagmentService>(PermissionManagmentService);
    permissionSvc = app.get<PermissionRecordService>(PermissionRecordService);
  });

  describe('verifyTest', () => {
    it('should throw error if novalid permssion', async () => {
      try {
        jest.spyOn(permissionSvc, 'find').mockResolvedValueOnce([]);
        const { institution, clientId } = validPermssion;
        await svc.verify(institution, clientId);
      } catch (error) {
        expect(error).toEqual(permssionVerificationError);
      }
    });

    it('should return valid permission if verified', async () => {
      jest.spyOn(permissionSvc, 'find').mockResolvedValueOnce([validPermssion]);
      const { institution, clientId } = validPermssion;
      expect(await svc.verify(institution, clientId)).toEqual(validPermssion);
    });
  });

  describe('requestTest', () => {
    it('should call the PermissionCreatorService.creator', async () => {
      const creatorSvc = app.get<PermissionCreatorService>(
        PermissionCreatorService,
      );
      const spy = jest.spyOn(creatorSvc, 'create').mockReturnValueOnce(null);
      const instituiton = 'institution';
      const clientId = '31533i313';
      await svc.request(instituiton, clientId);
      expect(spy).toHaveBeenCalledWith(instituiton, clientId);
    });
  });

  describe('authorizeTest', () => {
    it(`should throw error if permission doesn't exist`, async () => {
      try {
        jest.spyOn(permissionSvc, 'findOne').mockResolvedValueOnce(null);
        await svc.authorize(validPermssion.id, 23333);
      } catch (error) {
        expect(error).toEqual(permissionRequestAuthorizationError);
      }
    });

    it('should return authorized permission', async () => {
      const invalidPerm = validPermssion;
      invalidPerm.authorized = false;
      jest.spyOn(permissionSvc, 'findOne').mockResolvedValueOnce(invalidPerm);
      jest
        .spyOn(permissionSvc.repository, 'save')
        .mockImplementation(arg => Promise.resolve(arg as PermissionRecord));
      const perm = await svc.authorize(invalidPerm.id, invalidPerm.code);
      expect(perm).toEqual(validPermssion);
    });
  });
});
