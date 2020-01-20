import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CommunalData, PersonalBiodata } from '@ulmax/frontend';
import { microServiceToken } from '@ulmax/server-shared';
import { combineLatest } from 'rxjs';
import { UlmaxCard } from '../data-layer/card/card.entity';
import { UlmaxFullCard } from '../typecast';

@Injectable()
export class CardFieldRetrivalService {
  constructor(@Inject(microServiceToken) private client: ClientProxy) {}

  /**
   * retrieves the full details of the card
   */
  public async detailed(card: UlmaxCard) {
    const [biodata, communaldata] = await this.parrallelretrival(
      card,
    ).toPromise();
    return { biodata, communaldata, card } as UlmaxFullCard;
  }

  private parrallelretrival(card: UlmaxCard) {
    const biodata$ = this.client.send<PersonalBiodata>('', {
      cardnode: card.id,
    } as Partial<PersonalBiodata>);
    const communal$ = this.client.send<CommunalData>('', {
      cardnode: card.id,
    } as Partial<CommunalData>);
    return combineLatest(biodata$, communal$);
  }
}
