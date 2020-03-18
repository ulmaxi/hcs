// tslint:disable: max-classes-per-file
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyController } from './controllers/emergency.controller';
import { PublicAccessController } from './controllers/public.controller';
import { Emergency } from './models/emergency.entity';
import { PublicDataService } from './services/data.service';
import { EmergencyService } from './services/emergency.service';
import { MicroService, Queues, AMQ_URL } from '@ulmax/microservice/shared';

@Module({
  imports: [TypeOrmModule.forFeature([Emergency])],
  providers: [EmergencyService],
  exports: [EmergencyService, TypeOrmModule],
})
export class GeneralPublicDataServiceModule {}

@Module({
  imports: [GeneralPublicDataServiceModule],
  controllers: [EmergencyController],
})
export class GeneralPublicDataControllerModule {}

@Module({
  imports: [
    GeneralPublicDataServiceModule,
    ClientsModule.register([
      {
        name: MicroService.EHR,
        transport: Transport.RMQ,
        options: {
          queue: Queues.EHR,
          urls: [AMQ_URL]
        }
      },
    ]),
  ],
  providers: [PublicDataService],
  controllers: [PublicAccessController],
})
export class GeneralPublicModule {}
