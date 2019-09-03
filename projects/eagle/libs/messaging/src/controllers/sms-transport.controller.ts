import { Controller } from '@nestjs/common';
import { SendSMSEvent, MessageEvents } from '@eagle/server-shared';
import { EventPattern } from '@nestjs/microservices';

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
