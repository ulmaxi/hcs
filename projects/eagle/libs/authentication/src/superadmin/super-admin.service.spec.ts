import { Test, TestingModule } from '@nestjs/testing';
import { AccessLevel, Authorization } from '../data-layer/author/author.entity';
import { AuthorService } from '../data-layer/author/author.service';
import { SuperAdminAuthorizeService, SuperAdminSignupError } from './super-admin.service';

const authServicMock = {
  findOne: jest.fn(),
  repository: {
    save: jest.fn,
  },
};

function superAdminFactory({
  accessLevel,
  apiKey,
  identification,
  trackId,
}: Partial<Authorization>): Authorization {
  const superAdminBase: Authorization = new Authorization();
  superAdminBase.trackId = trackId;
  superAdminBase.accessLevel = accessLevel || AccessLevel.SuperAdmin;
  superAdminBase.apiKey = apiKey;
  superAdminBase.identification = identification;
  return superAdminBase;
}

describe('SuperAdminAuthorizeService', () => {
  let superAdminSvc: SuperAdminAuthorizeService;
  let authorSvc: AuthorService;
  const superAdminBase = superAdminFactory({
    trackId: 'trackID',
    identification: 'uniqueId',
    apiKey: 'randomApiKey',
  });

  const authorizeRequestBase = {
    accessLevel: AccessLevel.SuperAdmin,
    identification: 'newIdentification',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SuperAdminAuthorizeService,
        { provide: AuthorService, useValue: authServicMock },
      ],
    }).compile();
    authorSvc = app.get<AuthorService>(AuthorService);
    superAdminSvc = app.get<SuperAdminAuthorizeService>(
      SuperAdminAuthorizeService,
    );
  });

  describe('createInitalAdmin', () => {
    it('should return an older admin if it exists', async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(superAdminBase);
      expect(await superAdminSvc.createInitalAdmin()).toEqual(superAdminBase);
    });

    it('should create a new admin if none exists before', async () => {
      const newAdmin = superAdminBase;
      newAdmin.identification = 'newAdminId';
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(null);
      const createSpy = jest.spyOn(superAdminSvc, 'createAdmin').mockResolvedValue(newAdmin);
      expect(await superAdminSvc.createInitalAdmin()).toEqual(newAdmin);
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('createAdmin', () => {
    it('should save a newly created admin and return an Authorization instance', async () => {
      const identification = 'a_new_super_admin_identification';
      const saveSpy = jest
        .spyOn(authorSvc.repository, 'save')
        .mockImplementation(async arg => (await arg) as Authorization);
      const savedAdmin = await superAdminSvc.createAdmin(identification);
      expect(savedAdmin.identification).toEqual(identification);
      expect(savedAdmin).toBeInstanceOf(Authorization);
    });
  });

  describe('signupAdmin', () => {
    it(`should throw error if admin apikey doesn't exist`, async () => {
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(null);
      expect(
        superAdminSvc.signupAdmin('apikey', authorizeRequestBase),
      ).rejects.toThrowError(SuperAdminSignupError);
    });

    it('should should throw error if oldAdmin is not a superadmin', () => {
      const oldAdmin = superAdminBase;
      oldAdmin.accessLevel = AccessLevel.Users;
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(oldAdmin);
      expect(
        superAdminSvc.signupAdmin('apikey', authorizeRequestBase),
      ).rejects.toThrowError(SuperAdminSignupError);
    });

    it('should call findOrCreateAdmin because of a valid OldAdmin', async () => {
      const oldAdmin = superAdminBase;
      oldAdmin.accessLevel = AccessLevel.SuperAdmin;
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(oldAdmin);
      const focaSpy = jest.spyOn(superAdminSvc, 'findOrCreateAdmin');
      await superAdminSvc.signupAdmin('apikey', authorizeRequestBase);
      expect(focaSpy).toHaveBeenCalledWith(authorizeRequestBase);
    });
  });

  describe('findOrCreateAdmin', () => {
    it('should update the admin to super user if previously existed', () => {
      const oldAdmin = superAdminBase;
      oldAdmin.accessLevel = AccessLevel.Users;
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(oldAdmin);
      const saveSpy = jest.spyOn(authorSvc.repository, 'save').mockImplementation((arg) => arg as Promise<Authorization>);
      superAdminSvc.findOrCreateAdmin(authorizeRequestBase);
      const newAdmin = oldAdmin;
      newAdmin.accessLevel = AccessLevel.SuperAdmin;
      expect(saveSpy).toHaveBeenCalledWith(newAdmin);
    });

    it('should create new admin if not previously existed', async () => {
      const newAdmin = superAdminBase;
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(null);
      jest.spyOn(superAdminSvc, 'createAdmin').mockResolvedValue(newAdmin);
      const adminRes = await superAdminSvc.findOrCreateAdmin(authorizeRequestBase);
      expect(adminRes).toBe(newAdmin);
    });
  });
});
