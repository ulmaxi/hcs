import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@ulmax/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';
import { DataAccessRecordsModule } from '@ulmax/data-access-records';

@Module({
  imports: [
    AuthenticationModule,
    DataAccessRecordsModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV)),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
