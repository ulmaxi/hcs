import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CommunalData,
  PersonalBiodata,
  PersonalBiodataCQREvents,
  CommunalDataCQREvents,
} from '@ulmax/users-admininistration';
import { combineLatest } from 'rxjs';
import { UlmaxCard } from '../data-layer/card/card.entity';
import { UlmaxFullCard } from './typecast';
import { MicroService } from '@ulmax/microservice/shared';

@Injectable()
export class CardFieldRetrivalService {
  constructor(@Inject(MicroService.CardNode) private users: ClientProxy) {}

  /**
   * retrieves the full details of the card
   */
  public async detailed(card: UlmaxCard) {
    const [biodata, communaldata] = await this.parrallelretrival(
      card,
    ).toPromise();
    return { biodata, communaldata, card } as UlmaxFullCard;
  }

  /**
   * combines the code execution in parallel with rxjs
   */
  private parrallelretrival(card: UlmaxCard) {
    const personal = new PersonalBiodataCQREvents.RetriveEventQuery({
      where: { cardnode: card.id },
    });
    const communal = new CommunalDataCQREvents.RetriveEventQuery({
      where: {
        cardnode: card.id,
      },
    });
    const biodata$ = this.users.send<PersonalBiodata>(
      personal.action,
      personal,
    );
    const communal$ = this.users.send<CommunalData>(communal.id, communal);
    return combineLatest(biodata$, communal$);
  }
}
