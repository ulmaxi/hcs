import { Test } from '@nestjs/testing';
import { AccessLevel, AuthorizeResponse } from '@eagle/generated';
import { HttpException } from '@nestjs/common';
import { AuthorizeRequestService, InvalidAuthCredentialsError } from './authorize-req.service';
import { AuthorService } from './author.service';
import { LoginService } from './login.service';
import { AuthorizeAlertService } from './authorize-alert.service';
import { Authorization } from '../models/author.entity';
import { Login } from '../models/login.entity';

describe('AuthorizeReqController', () => {
  let authorReqSvc: AuthorizeRequestService;
  let authSvc: AuthorService;
  let loginSvc: LoginService;
  let alertSvc: AuthorizeAlertService;

  const baseAuthor = new Authorization();
  baseAuthor.accessLevel = AccessLevel.Users;
  baseAuthor.identification = '0321386311';
  baseAuthor.trackId = 'randomuniqueid';
  const baseLogin = new Login();
  baseLogin.expires = 137139871;
  baseLogin.id = 'randomiloginid';
  baseLogin.trackingId = baseAuthor.trackId;
  baseLogin.otp = 123456;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthorizeRequestService,
        {
          provide: AuthorService,
          useValue: { findOne: () => { }, repository: { save: jest.fn } },
        },
        { provide: LoginService, useValue: { repository: { save: jest.fn } } },
        { provide: AuthorizeAlertService, useValue: { send: jest.fn } },
      ],
    }).compile();

    authorReqSvc = module.get<AuthorizeRequestService>(AuthorizeRequestService);
    loginSvc = module.get<LoginService>(LoginService);
    alertSvc = module.get<AuthorizeAlertService>(AuthorizeAlertService);
    authSvc = module.get<AuthorService>(AuthorService);
  });

  describe('authorize', () => {
    it('should authorize the request and send the otp', async () => {
      jest
        .spyOn(authorReqSvc, 'createOrRetrieve')
        .mockResolvedValue(baseAuthor);
      const { expires, id } = baseLogin;
      const formatSpy = jest.spyOn(authorReqSvc, 'authorizeResponse').mockResolvedValue({ expires, loginId: id });
      const rep = await authorReqSvc.authorize(baseAuthor);
      expect(formatSpy).toHaveBeenCalled();
      expect(rep).toEqual({ expires, loginId: id } as AuthorizeResponse);
    });

    it('should throw unauthorized execption for invalid authorization', async () => {
      try {
        jest
          .spyOn(authorReqSvc, 'createOrRetrieve')
          .mockResolvedValue(null);
        const rep = await authorReqSvc.authorize(baseAuthor);
      } catch (error) {
        expect(error).toEqual(InvalidAuthCredentialsError);
      }
    });

    it('should thrown an http execption for any error occuring', async () => {
      try {
        const errorMgs = `Error thrown while attempting something`;
        jest
          .spyOn(authorReqSvc, 'createOrRetrieve')
          .mockRejectedValue(errorMgs);
        await authorReqSvc.authorize(baseAuthor);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('authorizeResponse', () => {
    it('should alert and authorize the request', async () => {
      const { expires, id } = baseLogin;
      jest.spyOn(authorReqSvc, 'registerlogin').mockResolvedValue(baseLogin);
      const alertSpy = jest.spyOn(alertSvc, 'send');
      const res = await authorReqSvc.authorizeResponse(baseAuthor);
      expect(res).toEqual({ expires, loginId: id });
      expect(alertSpy).toHaveBeenCalledWith(baseAuthor, baseLogin);
    });
  });

  describe('createOrRetrieve', () => {
    it('should return already saved one without remapping to save', async () => {
      jest.spyOn(authSvc, 'findOne').mockResolvedValue(baseAuthor);
      const { identification, accessLevel } = baseAuthor;
      expect(
        await authorReqSvc.createOrRetrieve({ identification, accessLevel }, true),
      ).toEqual(baseAuthor);
    });

    it('should create by remapping to save if regiserIfNotFound is true', async () => {
      jest.spyOn(authSvc, 'findOne').mockResolvedValue(null);
      jest.spyOn(authSvc.repository, 'save').mockResolvedValue(baseAuthor);
      const { identification, accessLevel } = baseAuthor;
      expect(
        await authorReqSvc.createOrRetrieve({ identification, accessLevel }, true),
      ).toEqual(baseAuthor);
    });

    it('should return null if regiserIfNotFound is false', async () => {
      jest.spyOn(authSvc, 'findOne').mockResolvedValue(null);
      const { identification, accessLevel } = baseAuthor;
      expect(
        await authorReqSvc.createOrRetrieve({ identification, accessLevel }, false),
      ).toEqual(null);
    });
  });

  describe('createDataRemap', () => {
    it('should remap access level if its missing', () => {
      const newAuthor = authorReqSvc.createDataRemap({
        accessLevel: undefined,
        identification: 'random',
      });
      expect(newAuthor.accessLevel).toEqual(AccessLevel.Users);
      expect(newAuthor).toBeInstanceOf(Authorization);
    });
    it('should remap access level if its requested as a superadmin', () => {
      const newAuthor = authorReqSvc.createDataRemap({
        accessLevel: AccessLevel.SuperAdmin,
        identification: 'random',
      });
      expect(newAuthor).toBeInstanceOf(Authorization);
      expect(newAuthor.accessLevel).toEqual(AccessLevel.Users);
    });
  });

  describe('registerlogin', () => {
    it('should save a generated login into the database', async () => {
      const saveSpy = jest
        .spyOn(loginSvc.repository, 'save')
        .mockImplementation(async login => (await login) as Login);
      const login = await authorReqSvc.registerlogin(baseAuthor);
      expect(saveSpy).toHaveBeenCalled();
      expect(login.trackingId).toEqual(baseAuthor.trackId);
      expect(typeof login.expires).toEqual('number');
    });
  });

  describe('otpExpires', () => {
    it('should return 3 for users and staffs', () => {
      expect(authorReqSvc.otpExpires(AccessLevel.Users)).toEqual(3);
      expect(authorReqSvc.otpExpires(AccessLevel.Staff)).toEqual(3);
    });
    it('should return 10 for instutions and super users', () => {
      expect(authorReqSvc.otpExpires(AccessLevel.Institution)).toEqual(10);
      expect(authorReqSvc.otpExpires(AccessLevel.SuperAdmin)).toEqual(10);
    });
  });
});
