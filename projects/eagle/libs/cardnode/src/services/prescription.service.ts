import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConsulationGraphSnaphot, ConsultationSnapshot, ReqMicroHistorySnapshot } from '@ulmax/ehr';
import { HistorySnapshotEvent } from '@ulmax/ehr/history-snapshot/history-snapshot.controller';
import { ModelEventActionStructure } from '@ulmax/microservice';
import { ModelRPC } from '@ulmax/microservice/crud.controller';
import { FindQueryParams, microServiceToken } from '@ulmax/server-shared';
import { PersonalBiodata } from '@ulmax/users-admininistration';
import { exhaustMap, map } from 'rxjs/operators';
import { ConsultatedDrug } from './typecast';

interface PrescriptionQuery {
  query: FindQueryParams;
  cardId: string;
  owner: string;
}

@Injectable()
export class CardPrescriptionService {
  constructor(@Inject(microServiceToken) private client: ClientProxy) {}

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
      this.client
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
    const req: ModelEventActionStructure = {
      model: PersonalBiodata,
      args: [{ cardnode: cardId } as Partial<PersonalBiodata>],
      method: 'findOne',
    };
    return this.client.send<PersonalBiodata>(ModelRPC, req);
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
