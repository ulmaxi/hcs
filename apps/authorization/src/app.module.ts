import { Module } from '@nestjs/common';
import { 
   SuperAdminAuthenticationModule, 
   AuthenticationModule
} from '@ulmax/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    AuthenticationModule,
     SuperAdminAuthenticationModule,
     TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV))
    ],
  controllers: [],
  providers: [],
})
export class AuthorizationAppModule {}
