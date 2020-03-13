import { Module } from '@nestjs/common';
import { MessagingModule } from '@ulmax/messaging';

@Module({
  imports: [MessagingModule],
})
export class AppModule {}
