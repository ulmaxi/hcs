// tslint:disable: max-classes-per-file
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { microServiceToken } from '@ulmax/server-shared';
import { EmergencyController } from './controllers/emergency.controller';
import { PublicAccessController } from './controllers/public.controller';
import { Emergency } from './models/emergency.entity';
import { PublicDataService } from './services/data.service';
import { EmergencyService } from './services/emergency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Emergency])],
  providers: [EmergencyService],
  exports: [EmergencyService, TypeOrmModule],
})
export class GeneralPublicDataServiceModule { }

@Module({
  imports: [GeneralPublicDataServiceModule],
  controllers: [EmergencyController],
})
export class GeneralPublicDataControllerModule { }

@Module({
  imports: [GeneralPublicDataServiceModule,
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ])],
  providers: [PublicDataService],
  controllers: [PublicAccessController],
})
export class GeneralPublicModule { }
