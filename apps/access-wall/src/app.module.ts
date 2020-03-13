import { Module } from '@nestjs/common';
import { DataAccessRecordsModule } from '@ulmax/data-access-records';

@Module({
  imports: [DataAccessRecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class DataAccessRecordAppModule {}
