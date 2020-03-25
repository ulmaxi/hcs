import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionCreatorService } from './access-managment/permission-creator.service';
import { PermissionManagmentService } from './access-managment/permission-managment.service';
import { AccessLogs } from './data-layer/access-logs/access-logs.entity';
import { PermissionRecord } from './data-layer/permission-records/permission-records.entity';
import { PermissionRecordService } from './data-layer/permission-records/permission-records.service';
import { MicroService, Queues, AMQ_URL } from '@ulmax/microservice/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLogs, PermissionRecord]),
    ClientsModule.register([
      {
        name: MicroService.Lota,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Lota,
          urls: [AMQ_URL],
        },
      },
      {
        name: MicroService.Authorization,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Authorization,
          urls: [AMQ_URL],
        },
      },
      {
        name: MicroService.CardNode,
        transport: Transport.RMQ,
        options: {
          queue: Queues.CardNode,
          urls: [AMQ_URL],
        },
      },
      {
        name: MicroService.Admin,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Admin,
          urls: [AMQ_URL],
        },
      },
    ]),
  ],
  providers: [
    PermissionRecordService,
    PermissionManagmentService,
    PermissionCreatorService,
  ],
})
export class DataAccessRecordsModule {}
