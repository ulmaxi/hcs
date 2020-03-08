// tslint:disable: max-classes-per-file
export enum MessageEvents {
  SMS = '[Messaging]__Send__SMS',
  Email = '[Messaging]__Send__Email',
}

/**
 * Event data sent for sms message MessageEvents.SMS"
 */
export class SendSMSEvent {
  public event = MessageEvents.SMS;
  constructor(
    public readonly contact: string,
    public readonly message: string,
  ) {}
}

/**
 * Event data sent for email "MessageEvents.Email"
 */
export class SendEmailEvent {
  public event = MessageEvents.Email;
  constructor(public readonly email: string, public readonly message: string) {}
}

export enum AuthenticationMessage {
  validate = '[Authentication]__validate__key',
}
