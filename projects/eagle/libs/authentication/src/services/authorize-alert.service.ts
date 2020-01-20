import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MessageEvents, microServiceToken, SendEmailEvent, SendSMSEvent } from '@ulmax/server-shared';
import { differenceInMinutes } from 'date-fns';
import { AccessLevel, Authorization } from '../models/author.entity';
import { Login } from '../models/login.entity';

/**
 * Authorize alert sends the otp code to the
 * entity through the right means
 */
@Injectable()
export class AuthorizeAlertService {
  constructor(
    @Inject(microServiceToken) private readonly client: ClientProxy,
  ) {}

  /**
   * compose the message and forward it to the right handler
   */
  send(
    { accessLevel, identification }: Authorization,
    { expires, otp }: Login,
  ) {
    const message = ` your OTP password is ${otp} and expires in ${differenceInMinutes(
      expires,
      Date.now(),
    )} minutes`;
    if (accessLevel < AccessLevel.Institution) {
      return this.sms(identification, message);
    }
    return this.email(identification, message);
  }

  /**
   * handles sending the message through sms
   */
  sms(phoneNo: string, message: string) {
    this.client
      .emit(MessageEvents.SMS, new SendSMSEvent(phoneNo, message))
      .toPromise();
  }

  /**
   * handles sending the message through sms
   */
  email(email: string, message: string) {
    this.client
      .emit(MessageEvents.Email, new SendEmailEvent(email, message))
      .toPromise();
  }
}
