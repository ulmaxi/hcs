import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConsulationGraphSnaphot,
  ConsultationSnapshot,
  ReqMicroHistorySnapshot,
} from '@ulmax/ehr';
import { HistorySnapshotEvent } from '@ulmax/ehr/history-snapshot/history-snapshot.controller';
import { FindQueryParams } from '@ulmax/server-shared';
import {
  PersonalBiodata,
  PersonalBiodataCQREvents,
} from '@ulmax/users-admininistration';
import { exhaustMap, map } from 'rxjs/operators';
import { ConsultatedDrug } from './typecast';
import { MicroService } from '@ulmax/microservice/shared';

interface PrescriptionQuery {
  query: FindQueryParams;
  cardId: string;
  owner: string;
}

@Injectable()
export class CardPrescriptionService {
  constructor(
    @Inject(MicroService.Lota) private lota: ClientProxy,
    @Inject(MicroService.CardNode) private users: ClientProxy,
  ) {}

  public async find(cardId: string, query?: FindQueryParams) {
    return this.Ownerprescriptions(cardId, query);
  }

  /**
   * retrieve prescriptions for a consultation
   */
  private Ownerprescriptions(cardId: string, query?: FindQueryParams) {
    return this.cardOwnerBiodata(cardId)
      .pipe(
        exhaustMap(({ firstname, lastname }) =>
          this.prescriptions({
            cardId,
            owner: `${firstname} ${lastname}`,
            query: { limit: 30, skip: 0, ...query },
          }),
        ),
      )
      .toPromise();
  }

  /**
   * the drug prescriptions
   */
  private prescriptions({ cardId, owner, query }: PrescriptionQuery) {
    const req: ReqMicroHistorySnapshot = {
      config: { depth: query.limit, skip: query.skip },
      query: { patientId: cardId },
    };
    return (
      this.lota
        .send<ConsulationGraphSnaphot[]>(HistorySnapshotEvent, req)
        // map graph to arrangment
        .pipe(map(g => this.sortGraphToTimeline(g, owner)))
        .toPromise()
    );
  }

  /**
   * retrieves the card owner biodata
   */
  private cardOwnerBiodata(cardId: string) {
    const userReq = new PersonalBiodataCQREvents.RetriveEventQuery({
      where: { cardnode: cardId },
    });
    return this.users.send<PersonalBiodata>(userReq.action, userReq);
  }

  /**
   * sorts the graph to a linear time arrangment
   */
  private sortGraphToTimeline(graph: ConsulationGraphSnaphot[], owner: string) {
    return graph
      .map(({ followUps, intital }) => [intital, ...followUps])
      .reduce((prev, cur) => [...prev, ...cur], [])
      .map(c => this.snapshotToPrescription(owner, c))
      .sort(
        (prev, cur) =>
          Date.parse(prev.date.toString()) - Date.parse(cur.date.toString()),
      );
  }

  /**
   * converts the snapshot to drug prescription
   */
  private snapshotToPrescription(owner: string, c: ConsultationSnapshot) {
    return {
      hopsital: c.institution.name,
      owner,
      prescriptions: c.prescriptions,
      date: c.createdAt,
    } as ConsultatedDrug;
  }
}
