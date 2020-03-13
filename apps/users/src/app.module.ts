import { Module } from '@nestjs/common';
import { UsersAdmininistrationModule, SuperUsersAdmininistrationModule } from '@ulmax/users-admininistration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    UsersAdmininistrationModule, 
    SuperUsersAdmininistrationModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV))
  ]
})
export class AppModule {}
