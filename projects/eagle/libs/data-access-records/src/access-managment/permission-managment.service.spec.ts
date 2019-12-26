import { Test, TestingModule } from '@nestjs/testing';
import {
  permssionVerificationError, PermissionManagmentService,
} from './permission-managment.service';
import { PermissionRecordService } from '../data-layer/permission-records/permission-records.service';
import { subMonths, addMonths } from 'date-fns';
import {
  microServiceToken,
} from '@eagle/server-shared';
import { DataRetrievalService } from './data-retrieval.service';
import { PermissionCreatorService } from './permission-creator.service';
import { PermissionRecord } from '../data-layer/permission-records/permission-records.entity';

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
  let svc: PermissionManagmentService;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [
        PermissionManagmentService,
        DataRetrievalService,
        { provide: PermissionRecordService, useValue: mockPermSvc },
        { provide: PermissionCreatorService, useValue: { create: () => null } },
        { provide: microServiceToken, useValue: { emit: () => null } },
      ],
    }).compile();

    svc = app.get<PermissionManagmentService>(PermissionManagmentService);
  });

  describe('verify', () => {
    it('should throw error if novalid permssion', async () => {
      const permissionSvc = app.get<PermissionRecordService>(PermissionRecordService);
      try {
        jest.spyOn(permissionSvc, 'find').mockResolvedValue([]);
        const { institution, clientId } = validPermssion;
        await svc.verify(institution, clientId);
      } catch (error) {
        expect(error).toEqual(permssionVerificationError);
      }
    });
    
    it('should return valid permission if verified', async () => {
      const permissionSvc = app.get<PermissionRecordService>(PermissionRecordService);
      jest.spyOn(permissionSvc, 'find').mockResolvedValue([validPermssion]);
      const { institution, clientId } = validPermssion;
      expect(await svc.verify(institution, clientId)).toEqual(
        validPermssion,
      );
    });
  });

  describe('filterAuthorizedPermission', () => {
    it('should return a valid permission if among the permissions', () => {
      expect(svc.filterAuthorizedPermission([validPermssion])).toEqual(
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
        svc.filterAuthorizedPermission([invalid1, invalid2]),
      ).toBeUndefined();
    });
  });

  describe('request', () => {
    it('should call the PermissionCreatorService.creator', async () => {
      const creatorSvc = app.get<PermissionCreatorService>(PermissionCreatorService);
      const spy = jest.spyOn(creatorSvc, 'create').mockReturnValue(null);
      const instituiton = 'institution';
      const clientId = '31533i313';
      await svc.request(instituiton, clientId);
      expect(spy).toHaveBeenCalledWith(instituiton, clientId);
    });
  });

});
