import { Module } from '@nestjs/common';
import { UsersAdmininistrationModule, SuperUsersAdmininistrationModule } from '@ulmax/users-admininistration';

@Module({
  imports: [
    UsersAdmininistrationModule, 
    SuperUsersAdmininistrationModule]
})
export class AppModule {}
