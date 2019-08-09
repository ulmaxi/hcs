import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  ValidateAuthorizedService,
  OTPValidationError,
} from './validate-author.service';
import { AuthorService } from './author.service';
import { LoginService } from './login.service';
import { Login } from '../models/login.entity';
import { Authorization } from '../models/author.entity';
import { SecurityKeys } from '@eagle/generated';

describe('ValidateAuthorizedService', () => {
  let validateSvc: ValidateAuthorizedService;
  let authorSvc: AuthorService;
  let loginSvc: LoginService;
  let jwtSvc: JwtService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        ValidateAuthorizedService,
        { provide: LoginService, useValue: { findOne: jest.fn } },
        { provide: AuthorService, useValue: { findOne: jest.fn } },
        { provide: JwtService, useValue: { signAsync: jest.fn } },
      ],
    }).compile();

    validateSvc = app.get<ValidateAuthorizedService>(ValidateAuthorizedService);
    authorSvc = app.get<AuthorService>(AuthorService);
    loginSvc = app.get<LoginService>(LoginService);
    jwtSvc = app.get<JwtService>(JwtService);
  });

  describe('validate', () => {
    it('should return author if login previously existed', async () => {
      const trackingId = 'trackingId';
      const login = new Login();
      login.trackingId = trackingId;
      const author = new Authorization();
      author.trackId = trackingId;
      jest.spyOn(loginSvc, 'findOne').mockResolvedValue(login);
      jest.spyOn(authorSvc, 'findOne').mockResolvedValue(author);
      expect(await validateSvc.validate({ id: '3233', otp: 31313 })).toEqual(
        author,
      );
    });

    it(`should throw error if login doesn't exist`, async () => {
      jest.spyOn(loginSvc, 'findOne').mockResolvedValue(null);
      try {
        await validateSvc.validate({ id: '3233', otp: 31313 });
      } catch (error) {
        expect(error).toEqual(OTPValidationError);
      }
    });
  });

  describe('securedKeys', () => {
    it('should sign with JWT and return securedKeys', async () => {
      const author = new Authorization();
      author.apiKey = 'randomApikey';
      const jwt = 'jwtstring';
      const keys = new SecurityKeys({ apiKey: author.apiKey, jwt });
      jest.spyOn(jwtSvc, 'signAsync').mockResolvedValue(jwt);
      expect(await validateSvc.securedKeys(author)).toEqual(keys);
    });
  });
});
