import { Test, TestingModule } from '@nestjs/testing';
import { authorizationFactory, RepoMock } from '@ulmax/testing';
import { AccessLevel } from '../data-layer/author/author.entity';
import { AuthorService } from '../data-layer/author/author.service';
import { SuperAdminAuthorizeService, SuperAdminSignupError } from './super-admin.service';

describe('SuperAdminAuthorizeService', () => {
  let module: TestingModule;
  const authServicMock = {
    findOne: jest.fn(),
    repository: new RepoMock(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        SuperAdminAuthorizeService,
        { provide: AuthorService, useValue: authServicMock },
      ],
    }).compile();
  });

  createIntialAdminTest(module);
  signupAdminTest(module);
});

function createIntialAdminTest(module: TestingModule) {
  const authorSvc = module.get(AuthorService);
  const admin = authorizationFactory.build({
    accessLevel: AccessLevel.SuperAdmin,
    identification: 'rootadmin@ulmax.tech',
  });
  const svc = module.get(SuperAdminAuthorizeService);
  describe('createInitalAdmin', () => {
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
}

function signupAdminTest(module: TestingModule) {
  const authorSvc = module.get(AuthorService);
  const oldAdmin = authorizationFactory.build({
    accessLevel: AccessLevel.SuperAdmin,
    identification: 'demo@ulmax.tech',
  });
  const newAdmin = authorizationFactory.build({
    accessLevel: AccessLevel.SuperAdmin,
    identification: 'rootadmin@ulmax.tech',
  });
  const svc = module.get(SuperAdminAuthorizeService);
  describe('signupAdmin', () => {
    it(`should throw error if old or current admin apikey doesn't exist`, async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(null);
      expect(svc.signupAdmin(oldAdmin.apiKey, newAdmin)).rejects.toThrowError(
        SuperAdminSignupError,
      );
    });

    it('should should throw error if oldAdmin is not a superadmin', () => {
      jest
        .spyOn(authorSvc, 'findOne')
        .mockResolvedValueOnce({ ...oldAdmin, accessLevel: AccessLevel.Users });
      expect(svc.signupAdmin(oldAdmin.apiKey, newAdmin)).rejects.toThrowError(
        SuperAdminSignupError,
      );
    });

    it('should create newAdmin', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValueOnce(oldAdmin);
      jest.spyOn(authorSvc.repository, 'save').mockResolvedValueOnce(newAdmin);
      const res = await svc.signupAdmin(oldAdmin.apiKey, newAdmin);
      expect(res).toEqual(newAdmin);
    });
  });
}
