import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { OTPValidationError } from '@ulmax/server-shared';
import { authorizationFactory, loginFactory } from '@ulmax/testing';
import { plainToClass } from 'class-transformer';
import { Authorization } from '../../data-layer/author/author.entity';
import { AuthorService } from '../../data-layer/author/author.service';
import { LoginService } from '../../data-layer/login/login.service';
import { SecurityKeys } from '../authorizer/typecast';
import { AuthorizedEventService } from './authorized-events.service';
import { ValidateAuthorizedService } from './validate-author.service';

describe('ValidateAuthorizedService', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ValidateAuthorizedService,
        { provide: LoginService, useValue: { findOne: jest.fn } },
        { provide: AuthorService, useValue: { findOne: jest.fn } },
        { provide: JwtService, useValue: { signAsync: jest.fn, decode: jest.fn } },
        {
          provide: AuthorizedEventService,
          useValue: {
            trigger: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  validateTest(module);
  securedKeysTest(module);
  verifyKeysTest(module);
});

function validateTest(module: TestingModule) {
  const author = authorizationFactory.build({});
  const login = loginFactory.build({ trackingId: author.trackId });
  const loginSvc = module.get(LoginService);
  const authorSvc = module.get(AuthorService);
  const svc = module.get(ValidateAuthorizedService);
  describe('validate', () => {
    it('should return author and trigger events', async () => {
      jest.spyOn(loginSvc, 'findOne').mockResolvedValue(login);
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(author);
      const eventSpy = jest.spyOn(module.get(AuthorizedEventService), 'trigger');
      const res = await svc.validate({ id: login.id, otp: login.otp, registering: false });
      expect(res).toEqual(author);
      expect(eventSpy).toHaveBeenCalledWith([author, false]);
    });

    it(`should throw error if login doesn't exist`, async () => {
      try {
        jest.spyOn(loginSvc, 'findOne').mockResolvedValue(null);
        const res = await svc.validate({ id: login.id, otp: login.otp, registering: false });
      } catch (error) {
        expect(error).toEqual(OTPValidationError);
      }
    });
  });

}

function securedKeysTest(module: TestingModule) {
  const svc = module.get(ValidateAuthorizedService);
  const jwtSvc = module.get(JwtService);
  describe('securedKeys', () => {
    it('should sign with JWT and return securedKeys', async () => {
      const author = new Authorization();
      author.apiKey = 'randomApikey';
      const jwt = 'jwtstring';
      const keys = plainToClass(SecurityKeys, { apiKey: author.apiKey, jwt });
      jest.spyOn(jwtSvc, 'signAsync').mockResolvedValue(jwt);
      expect(await svc.securedKeys(author)).toEqual(keys);
    });
  });
}

function verifyKeysTest(module: TestingModule) {
  const svc = module.get(ValidateAuthorizedService);
  const jwtSvc = module.get(JwtService);
  const authorSvc = module.get(AuthorService);
  describe('verifyKeys', () => {
    it('should retrieve the author with the apikey directly', () => {
      const authorSpy = jest.spyOn(authorSvc, 'findOne');
      const apiKey = 'random-apikey';
      svc.verifyKeys('apikey', apiKey);
      expect(authorSpy).toBeCalledWith({ apiKey });
    });

    it('should decode the token if the format is missing', () => {
      const jwtSpy = jest.spyOn(jwtSvc, 'decode');
      const jwtToken = 'random-apikey';
      svc.verifyKeys('jwt', jwtToken);
      expect(jwtSpy).toBeCalledWith(jwtToken);
    });
  });
}
