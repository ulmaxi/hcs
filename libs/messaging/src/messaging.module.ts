import { Module } from '@nestjs/common';
import { SMSTransportController } from './controllers/sms-transport.controller';

@Module({
  controllers: [SMSTransportController],
})
export class MessagingModule {}
