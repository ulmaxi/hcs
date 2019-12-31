import { Test } from '@nestjs/testing';
import { AuthorizeAlertService } from './authorize-alert.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  microServiceToken,
  MessageEvents,
  SendSMSEvent,
  SendEmailEvent,
} from '@eagle/server-shared';
import { Authorization, AccessLevel } from '../models/author.entity';
import { Login } from '../models/login.entity';
import { addMinutes, format } from 'date-fns';

const authorizeBase: Partial<Authorization> = {
  accessLevel: AccessLevel.Staff,
  identification: 'random-identification',
};

const login: Partial<Login> = {
  expires: Number(format(addMinutes(Date.now(), 10), 'x')),
  otp: 12233,
};

describe('AuthorizeAlertService', () => {
  let alertSvc: AuthorizeAlertService;
  let clientSvc: ClientProxy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthorizeAlertService,
        {
          provide: microServiceToken,
          useValue: { emit: () => ({ toPromise: jest.fn }) },
        },
      ],
    }).compile();

    alertSvc = module.get<AuthorizeAlertService>(AuthorizeAlertService);
    clientSvc = module.get<ClientProxy>(microServiceToken);
  });

  describe('send', () => {
    it('should send the message through sms', async () => {
      const spy = jest.spyOn(alertSvc, 'sms');
      alertSvc.send(authorizeBase as Authorization, login as Login);
      expect(spy).toHaveBeenCalled();
    });

    it('should send the message through email', async () => {
      const spy = jest.spyOn(alertSvc, 'email');
      const inistutionBase = authorizeBase;
      inistutionBase.accessLevel = AccessLevel.Institution;
      alertSvc.send(authorizeBase as Authorization, login as Login);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('sms', () => {
    it('should send message to the contact through the client', () => {
      const phone = '0193978247';
      const message = 'a random message from heaven';
      jest
        .spyOn(clientSvc as any, 'emit')
        .mockImplementationOnce((pattern, data) => {
          expect(pattern).toEqual(MessageEvents.SMS);
          expect(data).toBeInstanceOf(SendSMSEvent);
          expect((data as SendSMSEvent).contact).toEqual(phone);
          expect((data as SendSMSEvent).message).toEqual(message);
          return {
            toPromise: jest.fn,
          };
        });
      alertSvc.sms(phone, message);
    });
  });

  describe('email', () => {
    it('should send email to the contact through the client', () => {
      const email = 'random@mail.com';
      const message = 'a random message from heaven';
      jest
        .spyOn(clientSvc as any, 'emit')
        .mockImplementationOnce((pattern, data) => {
          expect(pattern).toEqual(MessageEvents.Email);
          expect(data).toBeInstanceOf(SendEmailEvent);
          expect((data as SendEmailEvent).email).toEqual(email);
          expect((data as SendEmailEvent).message).toEqual(message);
          return {
            toPromise: jest.fn,
          };
        });
      alertSvc.email(email, message);
    });
  });
});
