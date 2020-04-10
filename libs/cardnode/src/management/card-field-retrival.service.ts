import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  BatchEventResult,
  RetrieveFromBatch,
} from '@ulmax/microservice/modelCQR';
import { MicroService } from '@ulmax/microservice/shared';
import {
  CommunalData,
  CommunalDataCQREvents,
  PersonalBiodata,
  PersonalBiodataCQREvents,
} from '@ulmax/users-admininistration';
import { combineLatest } from 'rxjs';
import { UlmaxCard } from '../data-layer/card/card.entity';
import { UlmaxFullCard } from './typecast';
import { map } from 'rxjs/operators';

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
    const biodata$ = this.users.send<PersonalBiodata>(
      personal.action,
      personal,
    );
    const communal = new CommunalDataCQREvents.RetriveEventQuery({
      where: {
        cardnode: card.id,
      },
    });
    const communal$ = this.users.send<CommunalData>(communal.action, communal);
    return combineLatest(biodata$, communal$);
  }

  /**
   * combines the code execution in parallel with rxjs
   */
  public async batchDetailed(cards: UlmaxCard[]) {
    if (cards.length > 0) {
      return await this.parallelBatchRetrieve(cards).toPromise();
    }
    return [];
  }

  private parallelBatchRetrieve(cards: UlmaxCard[]) {
    const nodes = cards.map(({ id }) => id);
    const biodata$ = this.personalParallel(nodes);
    const communal$ = this.communalParallel(nodes);
    return combineLatest(biodata$, communal$).pipe(
      map(this.destructureBatch(cards)),
    );
  }

  /**
   * batch request the retrieved query
   */
  private personalParallel(nodes: string[]) {
    const personals = new PersonalBiodataCQREvents.FindEventQuery(
      { nodes },
      {},
      `cardnode IN (:nodes)`,
    );
    return this.users.send<PersonalBiodata[]>(personals.action, personals);
  }

  /**
   * batch request the retrieved query
   */
  private communalParallel(nodes: string[]) {
    const communals = new CommunalDataCQREvents.FindEventQuery(
      { nodes },
      {},
      `cardnode IN (:nodes)`,
    );
    return this.users.send<CommunalData[]>(communals.action, communals);
  }

  private destructureBatch(cards: UlmaxCard[]) {
    return ([personals, communals]: [
      PersonalBiodata[],
      CommunalData[]
    ]) => {
      const entries = (results: (PersonalBiodata|CommunalData)[]) =>
        results.map(data => [data.cardnode, data]);
      const biodatas = new Map<string, PersonalBiodata>(entries(personals) as any);
      const communalDatas = new Map<string, CommunalData>(entries(communals) as any);
      return cards.map(card => ({
        card,
        biodata: biodatas.get(card.id),
        communaldata: communalDatas.get(card.id),
      }));
    };
  }
}
