import { Injectable } from '@nestjs/common';
import { Authorization, Login, AccessLevel } from '@eagle/generated';
import { differenceInMinutes } from 'date-fns';

/**
 * Authorize alert sends the otp code to the
 * entity through the right means
 */
@Injectable()
export class AuthorizeAlertService {
  constructor() {}

  /**
   * compose the message and forward it to the right handler
   */
  send(
    { accessLevel, identification }: Authorization,
    { expires, otp }: Login,
  ) {
    const message = ` your OTP password is ${otp} and expires in ${differenceInMinutes(
      expires,
      Date.now()
    )} minutes`;
    console.log(message);
    if (accessLevel < AccessLevel.Institution) {
      return this.sms(identification, message);
    }
    return this.email(identification, message);
  }

  /**
   * handles sending the message through sms
   */
  sms(phoneNo: string, message: string) {}

  /**
   * handles sending the message through sms
   */
  email(email: string, message: string) {}
}
