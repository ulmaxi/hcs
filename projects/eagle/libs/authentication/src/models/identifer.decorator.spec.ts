import { validate } from 'class-validator';
import { hcsIdentifer, HcsIdentiferConstraint } from './indentier.decorator';

class TestClass {
  @hcsIdentifer()
  identifer: string;
}

describe('HcsIdentifer ', () => {
  describe('constraint', () => {
    const constraint = new HcsIdentiferConstraint();
    describe('validate', () => {
      it('should return false if identifer is not a valid phoneNo or email', () => {
        expect(constraint.validate('12334')).toEqual(false);
        expect(constraint.validate('@mail.com')).toEqual(false);
      });
      it('should return true if identifer is a valid phoneNo', () => {
        expect(constraint.validate('+2348149464288')).toEqual(true);
        expect(constraint.validate('08149464288')).toEqual(true);
      });
      it('should return true if identifer is a valid email address', () => {
        expect(constraint.validate('abiodunogundijo@gmail.com')).toEqual(true);
      });
    });

    describe('defaultMessage', () => {
      it('should return the deafult message', () => {
        expect(typeof constraint.defaultMessage()).toEqual('string');
      });
    });
  });

  describe('decorator', () => {
    it('should throw error if its an invalid phone Number', async () => {
      const auth = new TestClass();
      auth.identifer = '081hsdhsddh';
      const res = await validate(auth);
      expect(res.length).toBeGreaterThan(0);
    });

    it('should throw error if is an invalid email Address', async () => {
      const auth = new TestClass();
      auth.identifer = '@mail.com';
      const res = await validate(auth);
      expect(res.length).toBeGreaterThan(0);
    });
  });
});
