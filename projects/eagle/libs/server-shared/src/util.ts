import * as chance from 'chance';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export const microServiceToken = 'Micro_Service_Token';

/**
 * error throw due to otp mismatch
 */
export const OTPValidationError = new BadRequestException(
  `otp validation error, recheck or resend the otp`,
);

/**
 * generates a six digit otp for the users
 */
export function generateOtp() {
  return new chance().integer({ max: 999999, min: 100000 });
}

export async function classValidationError<T>(value: T) {
  let message = null;
  const errors = await validate(value);
  if (errors.length > 0) {
    message = ' ';
    for (const { constraints } of errors) {
      const constraintMessage = Object.values(constraints).reduce(
        (pr, cr) => `${pr} ${cr}`,
        '',
      );
      message = message + `${constraintMessage} `;
    }
  }
  return message;
}

export async function requestError<T>(obj: T) {
  const errorMessage = await classValidationError(obj);
  /** istanbul ignore else */
  if (!errorMessage) {
    return;
  }
  throw new BadRequestException(errorMessage);
}
