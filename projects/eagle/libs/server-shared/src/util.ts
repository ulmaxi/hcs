import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as chance from 'chance';
import { validate } from 'class-validator';

/**
 * the property is nullable
 */
export type Nullable<T> = null | T;

/**
 * an array of the item type T
 */
export type List<T> = T[];

export const microServiceToken = 'Micro_Service_Token';

/**
 * error throw due to otp mismatch
 */
export const OTPValidationError = new UnauthorizedException(
  `otp validation error, recheck or resend the otp`,
);

/**
 * generates a six digit otp for the users
 */
export function generateOtp() {
  return new chance().integer({ max: 99999, min: 10000 });
}

/**
 * collates all the error and format them to an error message
 */
export async function classValidationError<T>(value: T) {
  let message: string = null;
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

/**
 * vaildates the object and simulteounsly throw the error
 */
export async function requestError<T>(obj: T) {
  const errorMessage = await classValidationError(obj);
  if (!errorMessage) {
    return;
  }
  /* istanbul ignore next */
  throw new BadRequestException(errorMessage);
}

/**
 * returns a tuple of the value and error of the promise
 */
export const awaitTo = async <T>(future: Promise<T>): Promise<[T, Error]> => {
  try {
      return [await future, undefined];
  } catch (error) {
      return [undefined, error];
  }
};
