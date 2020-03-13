import { Test, TestingModule } from '@nestjs/testing';
import { authorizationFactory, RepoMock } from '@ulmax/testing';
import { AuthorService } from '../data-layer/author/author.service';
import { AccessLevel } from '../data-layer/author/constants';
import { SuperAdminAuthorizeService, SuperAdminSignupError } from './super-admin.service';

describe('SuperAdminAuthorizeService', () => {
  let app: TestingModule;
  let svc: SuperAdminAuthorizeService;
  let authorSvc: AuthorService;

  const authServicMock = {
    findOne: jest.fn(),
    repository: new RepoMock(),
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      providers: [
        SuperAdminAuthorizeService,
        { provide: AuthorService, useValue: authServicMock },
      ],
    }).compile();
    svc = app.get(SuperAdminAuthorizeService);
    authorSvc = app.get(AuthorService);
  });

  describe('createInitalAdmin', () => {
    const admin = authorizationFactory.build({
      accessLevel: AccessLevel.SuperAdmin,
      identification: 'rootadmin@ulmax.tech',
    });
    it('should return an older admin if it exists', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(admin);
      expect(await svc.createInitalAdmin()).toEqual(admin);
    });

    it('should create a new admin if none exists before', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(null);
      jest.spyOn(authorSvc.repository, 'save').mockResolvedValue(admin);
      expect(await svc.createInitalAdmin()).toEqual(admin);
    });
  });

  describe('signupAdmin', () => {
    const oldAdmin = authorizationFactory.build({
      accessLevel: AccessLevel.SuperAdmin,
      identification: 'demo@ulmax.tech',
    });
    const newAdmin = authorizationFactory.build({
      accessLevel: AccessLevel.SuperAdmin,
      identification: 'rootadmin@ulmax.tech',
    });

    it(`should throw error if old or current admin apikey doesn't exist`, async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(null);
      try {
        await svc.signupAdmin(oldAdmin.apiKey, newAdmin);
      } catch (error) {
        expect(error).toEqual(SuperAdminSignupError);
      }
    });

    it('should should throw error if oldAdmin is not a superadmin', async () => {
      jest
        .spyOn(authorSvc, 'findOne')
        .mockResolvedValueOnce({ ...oldAdmin, accessLevel: AccessLevel.Users });
      try {
        await svc.signupAdmin(oldAdmin.apiKey, newAdmin);
      } catch (error) {
        expect(error).toEqual(SuperAdminSignupError);
      }
    });

    it('should create newAdmin', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(oldAdmin);
      jest.spyOn(authorSvc.repository, 'save').mockResolvedValueOnce(newAdmin);
      const res = await svc.signupAdmin(oldAdmin.apiKey, newAdmin);
      expect(res).toEqual(newAdmin);
    });
  });
});
