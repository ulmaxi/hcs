import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/* istanbul ignore next */
/**
 * Auth decorator to select auth details from the request
 * (it's being ignored due to the fact that it can't be unit tested)
 * (and would be added back during integration or E2E tests)
 */
export const Authorized = createParamDecorator((data, { headers }: Request) => {
  const securedKey = ([format, key]: string[]) => ({
    format,
    key,
  });
  const auth = headers?.authorization?.split(':') ?? [];
  if (auth.length > 1) {
    return securedKey(auth);
  }
  throw authorizationExpected;
});

/** error thrown the user authorization is required */
export const authorizationExpected = new UnauthorizedException(
  `please login or relogin to retrieve new token for authorization`,
);
