import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AMQ_URL, MicroService, Queues } from '@ulmax/microservice/shared';
import { UlmaxCardProviderModule } from './data-layer/card/card.module';
import { CardCreatorService } from './management/card-creator.service';
import { CardFieldRetrivalService } from './management/card-field-retrival.service';
import { CardAdminController } from './management/card-request.controller';
import { CardRequestService } from './management/card-request.service';
import { CardNodeController } from './management/cardnode.controller';
import { CardMemberService } from './management/cardnode.service';
import { MemberPrescriptionController } from './services/prescription.controller';
import { CardPrescriptionService } from './services/prescription.service';
import { BiodataManagerService } from './management/biodata-manager.service';

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
        name: MicroService.CardNode,
        transport: Transport.RMQ,
        options: {
          queue: Queues.CardNode,
          urls: [AMQ_URL],
        },
      },
      {
        name: MicroService.Lota,
        transport: Transport.RMQ,
        options: {
          queue: Queues.Lota,
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
    CardRequestService,
    BiodataManagerService
  ],
  controllers: [
    CardNodeController,
    CardAdminController,
    MemberPrescriptionController,
  ],
})
export class CardnodeModule {}
