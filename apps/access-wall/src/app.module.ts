import { Module } from '@nestjs/common';
import { DataAccessRecordsModule } from '@ulmax/data-access-records';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    DataAccessRecordsModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV)),
  ],
})
export class DataAccessRecordAppModule {}
