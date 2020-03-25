import { Module } from '@nestjs/common';
import { MessagingModule } from '@ulmax/messaging';
import { SuperAdminAuthenticationModule } from '@ulmax/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    MessagingModule,
    SuperAdminAuthenticationModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV)),
  ],
})
export class AppModule {}
