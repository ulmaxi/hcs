import { Test, TestingModule } from '@nestjs/testing';
import { authorizationFactory, loginFactory, RepoMock } from '@ulmax/testing';
import { AccessLevel } from '../../data-layer/author/author.entity';
import { AuthorService } from '../../data-layer/author/author.service';
import { LoginService } from '../../data-layer/login/login.service';
import { AuthorizeAlertService } from './authorize-alert.service';
import { AuthorizeRequestService, InvalidAuthCredentialsError } from './authorize-req.service';
describe('AuthorizeReqController', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthorizeRequestService,
        {
          provide: AuthorService,
          useValue: { findOne: () => {}, repository: new RepoMock() },
        },
        { provide: LoginService, useValue: { repository: new RepoMock() } },
        { provide: AuthorizeAlertService, useValue: { send: jest.fn } },
      ],
    }).compile();
  });

  authorizedTest(module);
  otpExpiresTest(module);
});

function authorizedTest(module: TestingModule) {
  const baseAuthor = authorizationFactory.build({
    accessLevel: AccessLevel.Users,
    identification: '0321386311',
  });
  const baseLogin = loginFactory.build({
    trackingId: baseAuthor.trackId,
    expires: 2,
  });

  const svc = module.get<AuthorizeRequestService>(AuthorizeRequestService);
  const authorSvc = module.get<AuthorService>(AuthorService);
  const loginSvc = module.get<LoginService>(LoginService);

  describe('authorize', () => {
    it('should register the author if not found', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(authorSvc.repository, 'save')
        .mockResolvedValueOnce(baseAuthor);
      jest.spyOn(loginSvc.repository, 'save').mockResolvedValueOnce(baseLogin);
      const rep = await svc.authorize(baseAuthor, true);
      expect(rep.loginId).toStrictEqual(baseLogin.id);
    });

    it('should throw unauthorized if user is not found', async () => {
      try {
        jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(null);
        await svc.authorize(baseAuthor);
      } catch (error) {
        expect(error).toEqual(InvalidAuthCredentialsError);
      }
    });

    it('should return the user if it exits', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(baseAuthor);
      jest.spyOn(loginSvc.repository, 'save').mockResolvedValueOnce(baseLogin);
      const rep = await svc.authorize(baseAuthor);
      expect(rep.loginId).toStrictEqual(baseLogin.id);
    });
  });
}

function otpExpiresTest(module: TestingModule) {
  const svc = module.get<AuthorizeRequestService>(AuthorizeRequestService);
  describe('otpExpires', () => {
    it('should return 3 for users and staffs', () => {
      expect(svc.otpExpires(AccessLevel.Users)).toEqual(3);
      expect(svc.otpExpires(AccessLevel.Staff)).toEqual(3);
    });
    it('should return 10 for instutions and super users', () => {
      expect(svc.otpExpires(AccessLevel.Institution)).toEqual(10);
      expect(svc.otpExpires(AccessLevel.SuperAdmin)).toEqual(10);
    });
  });
}
