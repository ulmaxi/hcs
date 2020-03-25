import { Module } from '@nestjs/common';
import { CardnodeModule } from '@ulmax/cardnode';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';
import { UsersAdmininistrationModule } from '@ulmax/users-admininistration';

@Module({
  imports: [
    CardnodeModule,
    UsersAdmininistrationModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV)),
  ],
})
export class AppModule {}
