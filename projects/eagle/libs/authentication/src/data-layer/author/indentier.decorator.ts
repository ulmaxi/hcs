import { registerDecorator, Validator, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * HcsIdentiferConstraint
 * The error throw when the identifier isn't an email or phoneNo
 */
@ValidatorConstraint({ name: 'identifer', async: false })
export class HcsIdentiferConstraint implements ValidatorConstraintInterface {
  validate(identifer: string) {
    const validator = new Validator();
    return (
      validator.isMobilePhone(identifer, 'en-NG') ||
      validator.isEmail(identifer)
    );
  }

  defaultMessage() {
    return `identifer ($value) is expected to be either
    a phone number for client or staff or email
     for organizations`;
  }
}

/**
 * Custom decorator to check if the entity
 * identification is either an email or phone number
 */
export function hcsIdentifer() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      propertyName,
      target: object.constructor,
      constraints: [],
      validator: HcsIdentiferConstraint,
    });
  };
}
