import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MessageEvents, SendSMSEvent } from '@ulmax/server-shared';

/**
 * TODO:
 * 1. Send
 * 2. List
 * 3. Retrieve
 */

@Controller('sms')
export class SMSTransportController {
  constructor() {}

  @EventPattern(MessageEvents.SMS)
  send(sms: SendSMSEvent) {
    console.log(`${sms.contact}: ${sms.message}`);
  }
}
