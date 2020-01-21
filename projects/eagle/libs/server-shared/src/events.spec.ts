import { SendEmailEvent, SendSMSEvent } from './events';

describe('Events', () => {
  describe('SendSMSEvent', () => {
    it('should declare its properites through the constructor', () => {
      const message = 'sure-message';
      const contact = '0133131';
      const smsEvnt = new SendSMSEvent(contact, message);
      expect(smsEvnt.contact).toEqual(contact);
      expect(smsEvnt.message).toEqual(message);
    });
  });

  describe('SendEmailEvent', () => {
    it('should declare its properites through the constructor', () => {
      const message = 'sure-message';
      const email = 'random@r.com';
      const emailEvnt = new SendEmailEvent(email, message);
      expect(emailEvnt.email).toEqual(email);
      expect(emailEvnt.message).toEqual(message);
    });
  });
});
