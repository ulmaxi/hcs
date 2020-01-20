import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { KeyVerification } from '../controllers/typecast';
import { AuthHeaderKeys } from './constants';

/* istanbul ignore next */
/**
 * Auth decorator to select auth details from the request
 * (it's being ignored due to the fact that it can't be unit tested)
 * (and would be added back during integration or E2E tests)
 */
export const Authorized = createParamDecorator((data, { headers }: Request) => {
  const { APIKEY, JWT } = AuthHeaderKeys;
  const format: string = headers[APIKEY] ? APIKEY : headers[JWT] ? JWT : null as any;
  if (format) {
    return  plainToClass(KeyVerification, {
      format,
      key: headers[format] as string,
    });
  }
  throw authorizationExpected;
});

/** error thrown the user authorization is required */
export const authorizationExpected = new UnauthorizedException(
  `please login or relogin to retrieve new token for authorization`,
);
