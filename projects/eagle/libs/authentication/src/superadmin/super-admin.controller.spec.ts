import { Test } from '@nestjs/testing';
import { AuthorizeRequest } from '../authorization/authorizer/typecast';
import { Authorization } from '../data-layer/author/author.entity';
import { SuperAdminAuthorizationController } from './super-admin.controller';
import { SuperAdminAuthorizeService } from './super-admin.service';

describe('Controller', () => {
  let ctrl: SuperAdminAuthorizationController;
  let svc: SuperAdminAuthorizeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SuperAdminAuthorizationController],
      providers: [
        { provide: SuperAdminAuthorizeService, useValue: { signupAdmin: jest.fn().mockResolvedValue(null)  } },
      ],
    }).compile();

    svc = module.get<SuperAdminAuthorizeService>(SuperAdminAuthorizeService);
    ctrl = module.get<SuperAdminAuthorizationController>(SuperAdminAuthorizationController);
  });

  describe('createAdmin', () => {
    it('should signup the new admin with params required', async () => {
      const auth = new Authorization();
      auth.apiKey = 'random-apikey';
      const body = new AuthorizeRequest();
      await ctrl.createAdmin(auth, body);
      expect(svc.signupAdmin).toBeCalledWith(auth.apiKey, body);
    });
  });
});
