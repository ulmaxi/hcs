import { microServiceToken } from '@eagle/server-shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HistoryController } from './history.controller';
import { HistorySnaphotService } from './snapshot.service';

/**
 * Calculates and return an array showing
 * the graph of consultations
 */
@Module({
  imports: [ClientsModule.register([{
    name: microServiceToken,
    transport: Transport.TCP,
  }])],
  controllers: [HistoryController],
  providers: [HistorySnaphotService],
})
export class EHRHistoryModule { }
