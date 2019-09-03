import { Test } from '@nestjs/testing';
import {
  AuthenticationController,
  keyVerificationError,
} from './authentication.controller';
import { AuthorizeRequestService } from '../services/authorize-req.service';
import { ValidateAuthorizedService } from '../services/validate-author.service';
import {
  AuthorizeRequest,
  ValidateAuthorizationReq,
  AuthorizedEntity,
} from './typecast';
import { AccessLevel, SecurityKeys } from '@eagle/generated';
import { Authorization } from '../models/author.entity';

describe('AuthenticationController', () => {
  let authCtrl: AuthenticationController;
  let authorReqSvc: AuthorizeRequestService;
  let validatorSvc: ValidateAuthorizedService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthorizeRequestService,
          useValue: { authorize: jest.fn },
        },
        {
          provide: ValidateAuthorizedService,
          useValue: {
            securedKeys: jest.fn,
            validate: jest.fn,
            verifyKeys: jest.fn,
          },
        },
      ],
    }).compile();

    validatorSvc = module.get<ValidateAuthorizedService>(
      ValidateAuthorizedService,
    );
    authorReqSvc = module.get<AuthorizeRequestService>(AuthorizeRequestService);
    authCtrl = module.get<AuthenticationController>(AuthenticationController);
  });

  describe('authorizeInsitution', () => {
    it('should authorize with institution accesslevel', async () => {
      const spy = jest
        .spyOn(authorReqSvc, 'authorize')
        .mockResolvedValueOnce(null);
      const req = new AuthorizeRequest();
      req.accessLevel = AccessLevel.Users;
      req.identification = 'example@test.com';
      await authCtrl.authorizeInsitution(req);
      const authorizedParam = req;
      authorizedParam.accessLevel = AccessLevel.Institution;
      expect(spy).toBeCalledWith(authorizedParam);
    });
  });

  describe('authorize', () => {
    it('should authorize with users accesslevel', async () => {
      const spy = jest
        .spyOn(authorReqSvc, 'authorize')
        .mockResolvedValueOnce(null);
      const req = new AuthorizeRequest();
      req.accessLevel = AccessLevel.SuperAdmin;
      req.identification = 'example@test.com';
      await authCtrl.authorize(req);
      const authorizedParam = req;
      authorizedParam.accessLevel = AccessLevel.Users;
      expect(spy).toBeCalledWith(authorizedParam);
    });
  });

  describe('validate', () => {
    it('should return an authorized entity', async () => {
      const xptdAuthorizedEntity = new AuthorizedEntity();
      xptdAuthorizedEntity.data = new Authorization();
      xptdAuthorizedEntity.keys = new SecurityKeys({ jwt: 'jwtbase64key' });
      const confirmOTP = new ValidateAuthorizationReq();
      confirmOTP.id = 'randomId';
      confirmOTP.otp = 123456;
      jest
        .spyOn(validatorSvc, 'validate')
        .mockResolvedValueOnce(xptdAuthorizedEntity.data);
      jest
        .spyOn(validatorSvc, 'securedKeys')
        .mockResolvedValueOnce(xptdAuthorizedEntity.keys);
      const entity = await authCtrl.validate(confirmOTP);
      expect(entity).toEqual(xptdAuthorizedEntity);
    });
  });

  describe('verify', () => {
    it('should throw error if no verification', async () => {
      try {
        jest.spyOn(validatorSvc, 'verifyKeys').mockResolvedValueOnce(null);
        await authCtrl.verify({ format: 'null', key: 'no-key' });
      } catch (error) {
        expect(error).toBe(keyVerificationError);
      }
    });
    it('should return verified Authorization details', async () => {
      const authorize = new Authorization();
      authorize.trackId = 'reandom-trackingId';
      jest.spyOn(validatorSvc, 'verifyKeys').mockResolvedValueOnce(authorize);
      const verified = await authCtrl.verify({
        format: 'jwt',
        key: 'random-JWT-KEY',
      });
      expect(verified).toEqual(authorize);
    });
  });
});
