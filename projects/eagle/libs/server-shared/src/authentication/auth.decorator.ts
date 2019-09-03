import { KeyVerification } from '@eagle/generated';
import { Request } from 'express';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export enum AuthHeaderKeys {
  JWT = 'BWIN_MPI_JWT_KEY'.toLowerCase() as any,
  APIKEY = 'BWIN_MPI_APIKEY_KEY'.toLowerCase() as any,
}

/**
 * Auth decorator to select auth details from the request
 */
export const Authorized = createParamDecorator((data, { headers }: Request) => {
  const { APIKEY, JWT } = AuthHeaderKeys;
  const format: string = headers[APIKEY] ? APIKEY : headers[JWT] ? JWT : null as any;
  if (format) {
    return new KeyVerification({
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
