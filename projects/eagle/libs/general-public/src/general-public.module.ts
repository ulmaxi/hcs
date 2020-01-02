// tslint:disable: max-classes-per-file
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyController } from './controllers/emergency.controller';
import { Emergency } from './models/emergency.entity';
import { PublicDataService } from './services/data.service';
import { EmergencyService } from './services/emergency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Emergency])],
  providers: [EmergencyService],
})
export class GeneralPublicDataServiceModule {}

@Module({
  imports: [GeneralPublicDataServiceModule],
  controllers: [EmergencyController],
})
export class GeneralPublicDataControllerModule {}

@Module({
  imports: [GeneralPublicDataServiceModule],
  providers: [PublicDataService],
})
export class GeneralPublicModule {}
