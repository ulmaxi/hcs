import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UlmaxCardProviderModule } from './data-layer/card/card.module';
import { CardCreatorService } from './management/card-creator.service';
import { CardFieldRetrivalService } from './management/card-field-retrival.service';
import { CardNodeController } from './management/cardnode.controller';
import { CardMemberService } from './management/cardnode.service';
import { MemberPrescriptionController } from './services/prescription.controller';
import { CardPrescriptionService } from './services/prescription.service';
import { MicroService, AMQ_URL, Queues } from '@ulmax/microservice/shared';

@Module({
  imports: [
    UlmaxCardProviderModule,
    ClientsModule.register([
      {
        name: MicroService.Authorization,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Authorization,
          urls: [AMQ_URL],
        },
      },
      {
        name: MicroService.Users,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Users,
          urls: [AMQ_URL],
        },
      },
      {
        name: MicroService.HistoryManager,
        transport: Transport.RMQ,
        options: {
          queue: Queues.HistoryManager,
          urls: [AMQ_URL],
        },
      },
    ]),
  ],
  providers: [
    CardMemberService,
    CardCreatorService,
    CardFieldRetrivalService,
    CardPrescriptionService,
  ],
  controllers: [CardNodeController, MemberPrescriptionController],
})
export class CardnodeModule {}
