import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthenticationModule } from '@eagle/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
