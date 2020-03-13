import { Module } from '@nestjs/common';
import { 
   SuperAdminAuthenticationModule, 
   AuthenticationModule
} from '@ulmax/authentication';

@Module({
  imports: [AuthenticationModule, SuperAdminAuthenticationModule],
  controllers: [],
  providers: [],
})
export class AuthorizationAppModule {}
