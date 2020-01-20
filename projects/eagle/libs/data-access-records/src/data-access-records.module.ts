import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { microServiceToken } from '@ulmax/server-shared';
import { DataRetrievalService } from './access-managment/data-retrieval.service';
import { PermissionCreatorService } from './access-managment/permission-creator.service';
import { PermissionManagmentService } from './access-managment/permission-managment.service';
import { AccessLogs } from './data-layer/access-logs/access-logs.entity';
import { PermissionRecord } from './data-layer/permission-records/permission-records.entity';
import { PermissionRecordService } from './data-layer/permission-records/permission-records.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLogs, PermissionRecord]),
    ClientsModule.register([
      { name: microServiceToken, transport: Transport.TCP },
    ]),
  ],
  providers: [
    DataRetrievalService,
    PermissionRecordService,
    PermissionManagmentService,
    PermissionCreatorService,
  ],
})
export class DataAccessRecordsModule {}
