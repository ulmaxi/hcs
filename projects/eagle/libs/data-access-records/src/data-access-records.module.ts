import { Module } from '@nestjs/common';
import { DataRetrievalService } from './services/data-retrieval.service';
import { InstitutionAccessService } from './services/institution-access.service';
import { PermissionRecordService } from './services/permission-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLogs } from './models/access-logs.entity';
import { PermissionRecord } from './models/permission-records.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microServiceToken } from '@eagle/server-shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLogs, PermissionRecord]),
    ClientsModule.register([
      { name: microServiceToken, transport: Transport.TCP },
    ]),
  ],
  providers: [
    DataRetrievalService,
    InstitutionAccessService,
    PermissionRecordService,
  ],
})
export class DataAccessRecordsModule {}
