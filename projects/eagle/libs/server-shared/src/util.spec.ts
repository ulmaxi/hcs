import * as validator from 'class-validator';
import * as utils from './util';
import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

const { generateOtp, classValidationError, requestError } = utils;

describe('Utilities', () => {
  describe('generateOtp', () => {
    it('should generate a 6 digit number', () => {
      const otp = generateOtp();
      expect(otp.toString()).toHaveLength(6);
    });
  });

  describe('classValidationError', () => {
    it('should return null error for no error', async () => {
      jest.spyOn(validator, 'validate').mockResolvedValueOnce([]);
      expect(await classValidationError({})).toBeNull();
    });

    it('should remap the errors to a message', async () => {
      const target = {};
      const errors: Partial<ValidationError>[] = [
        {
          target,
          property: 'otp',
          constraints: {
            min: 'must be length be minimum of 1',
            max: 'must be length be maximum of 10',
          },
        },
      ];
      jest.spyOn(validator, 'validate').mockResolvedValueOnce(errors as any);
      const message = await classValidationError({});
      expect(typeof message).toEqual('string');
      expect(message).toContain('minimum');
      expect(message).toContain('maximum');
    });
  });

  describe('requestError', () => {
    it(`should't throw error for non error message`, async () => {
      jest.spyOn(utils, 'classValidationError').mockResolvedValueOnce(null);
      await requestError({});
    });
    it('should throw error is there is validation error', async () => {
      const errMgs = `the error message thrown`;
      try {
        jest.spyOn(utils, 'classValidationError').mockResolvedValueOnce(errMgs);
        await requestError({});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as Error).message).toEqual(errMgs);
      }
    });
  });
});
