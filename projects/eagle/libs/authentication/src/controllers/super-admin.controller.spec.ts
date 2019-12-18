import { Test } from '@nestjs/testing';
import { SuperAdminAuthorizationController } from './super-admin.controller';
import { SuperAdminAuthorizeService } from '../services/super-admin.service';
import { Authorization } from '../models/author.entity';
import { AuthorizeRequest } from './typecast';
import { AuthorizedPipe } from '@eagle/server-shared';

import { PipeTransform, Injectable, ArgumentMetadata, INestApplication } from '@nestjs/common';

@Injectable()
export class AuthorizedPipeMock implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}

describe('Controller', () => {
  let superAdminCtrlr: SuperAdminAuthorizationController;
  let superAdminSvc: SuperAdminAuthorizeService;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SuperAdminAuthorizationController],
      providers: [
        {
          provide: SuperAdminAuthorizeService,
          useValue: { signupAdmin: jest.fn },
        },
        {
          provide: AuthorizedPipe,
          useValue: AuthorizedPipeMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    superAdminSvc = module.get<SuperAdminAuthorizeService>(
      SuperAdminAuthorizeService,
    );
    superAdminCtrlr = module.get<SuperAdminAuthorizationController>(
      SuperAdminAuthorizationController,
    );
  });

  xdescribe('createAdmin', () => {
    it('should signup the new admin with params required', async () => {
      const spy = jest.spyOn(superAdminSvc, 'signupAdmin');
      const auth = new Authorization();
      auth.apiKey = 'random-apikey';
      const body = new AuthorizeRequest();
      await superAdminCtrlr.createAdmin(auth, body);
      expect(spy).toBeCalledWith(auth.apiKey, body);
    });
  });
});
