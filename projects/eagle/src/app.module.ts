import { Module, Logger, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthenticationModule,
  SuperAdminAuthenticationModule,
} from '@eagle/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAccessRecordsModule } from '@eagle/data-access-records';
import {
  UsersAdmininistrationModule,
  SuperUsersAdmininistrationModule,
} from '@eagle/users-admininistration';
import { MessagingModule } from '@eagle/messaging';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import {
  microServiceToken,
  MessageEvents,
  SendSMSEvent,
  AuthorizedPipe,
} from '@eagle/server-shared';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { SipAdminModule, SipModule } from '@eagle/sip';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    SipModule,
    SipAdminModule,
    AuthenticationModule,
    SuperAdminAuthenticationModule,
    DataAccessRecordsModule,
    SuperUsersAdmininistrationModule,
    UsersAdmininistrationModule,
    MessagingModule,
    TypeOrmModule.forRoot(),
    RouterModule.forRoutes(routes),
  ],
  controllers: [AppController],
  providers: [AppService, Logger, AuthorizedPipe],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @Inject(microServiceToken) private readonly client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    // const c = await this.client.connect();
    const a = await this.client
      .emit(MessageEvents.SMS, new SendSMSEvent('clientPhoneNo', 'message'))
      .toPromise();
    console.log(a);
    console.log(
      `-------------------------${new Date()}------------------------------------`,
    );
  }
}
