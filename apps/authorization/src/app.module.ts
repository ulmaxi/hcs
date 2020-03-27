import { Module } from '@nestjs/common';
import { AuthenticationModule, Login, Authorization } from '@ulmax/authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';
import { DataAccessRecordsModule, AccessLogs, PermissionRecord } from '@ulmax/data-access-records';

@Module({
  imports: [
    AuthenticationModule,
    DataAccessRecordsModule,
    TypeOrmModule.forRoot({...configDatabase(process.env.NODE_ENV),
    entities: [AccessLogs, PermissionRecord, Login, Authorization]
  }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
