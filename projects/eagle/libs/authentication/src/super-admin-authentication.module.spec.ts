import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { authorizationFactory } from '@ulmax/testing';
import { SuperAdminAuthorizeService } from './services/super-admin.service';
import { SuperAdminAuthenticationModule } from './super-admin-authentication.module';

describe('Controller', () => {
  let svc: SuperAdminAuthenticationModule;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        SuperAdminAuthenticationModule,
        {
          provide: SuperAdminAuthorizeService, useValue: {
            createInitalAdmin: jest.fn().mockReturnValue(authorizationFactory.build()),
          },
        },
        Logger,
      ],
    }).compile();

    svc = module.get<SuperAdminAuthenticationModule>(SuperAdminAuthenticationModule);
  });

  it('should be create the inital super admin', async () => {
    const adminSvc = module.get<SuperAdminAuthorizeService>(SuperAdminAuthorizeService);
    svc.onModuleInit();
    expect(adminSvc.createInitalAdmin).toHaveBeenCalled();
  });

});
