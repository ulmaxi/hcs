import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microServiceToken } from '@ulmax/server-shared';
import { UlmaxCardProviderModule } from './data-layer/card/card.module';
import { CardCreatorService } from './management/card-creator.service';
import { CardFieldRetrivalService } from './management/card-field-retrival.service';
import { CardNodeController } from './management/cardnode.controller';
import { CardMemberService } from './management/cardnode.service';
import { MemberPrescriptionController } from './services/prescription.controller';
import { CardPrescriptionService } from './services/prescription.service';

@Module({
  imports: [
    UlmaxCardProviderModule,
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
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
